import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ensureDir, slugify, timestamp } from "./lib/env.mjs";

const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const generatedImagesDir = path.join(codexHome, "generated_images");

function findNewestCodexImage(since) {
  if (!fs.existsSync(generatedImagesDir)) return null;
  let newest = null;
  let newestMtime = since;

  for (const entry of fs.readdirSync(generatedImagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const sessionDir = path.join(generatedImagesDir, entry.name);
    for (const file of fs.readdirSync(sessionDir)) {
      if (!file.endsWith(".png")) continue;
      const filePath = path.join(sessionDir, file);
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs > newestMtime) {
        newestMtime = stat.mtimeMs;
        newest = filePath;
      }
    }
  }
  return newest;
}

function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  if (totalSec >= 60) return `${Math.floor(totalSec / 60)}分${totalSec % 60}秒`;
  return `${totalSec}秒`;
}

function getImageDimensions(filePath) {
  const output = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`, { encoding: "utf8" });
  const w = output.match(/pixelWidth:\s*(\d+)/)?.[1];
  const h = output.match(/pixelHeight:\s*(\d+)/)?.[1];
  return { width: Number(w), height: Number(h) };
}

export async function generate({ prompt, name, outDir = "gen/outputs", size, n = 1 }) {
  let codexVersion;
  try {
    codexVersion = execSync("codex --version", { encoding: "utf8" }).trim();
  } catch {
    throw new Error("未找到 codex CLI。请先安装：npm install -g @openai/codex");
  }

  n = Math.min(n, 10);
  const runId = `${timestamp()}-${slugify(name || prompt.slice(0, 48))}`;
  const dir = path.resolve(outDir, runId);
  ensureDir(dir);

  const written = [];
  const codexMeta = { version: codexVersion, original_path: null };
  const imageSizes = [];
  const totalStart = Date.now();

  for (let i = 0; i < n; i++) {
    if (n > 1) process.stderr.write(`正在生成 ${i + 1}/${n}...\n`);

    const genStart = Date.now();
    execSync(
      `codex exec -s workspace-write --skip-git-repo-check ${JSON.stringify(`Use the image generation tool to create an image with this prompt:\n\n${prompt}`)}`,
      { encoding: "utf8", timeout: 600_000, stdio: ["pipe", "pipe", "inherit"] }
    );

    const savedPath = findNewestCodexImage(genStart);
    if (!savedPath) {
      throw new Error(`第 ${i + 1} 张图片生成失败：未在 ${generatedImagesDir} 中找到新生成的图片`);
    }

    const outputPath = path.join(dir, `${String(i + 1).padStart(2, "0")}.png`);
    fs.copyFileSync(savedPath, outputPath);
    codexMeta.original_path = savedPath;

    const dims = getImageDimensions(outputPath);
    imageSizes.push({ ...dims, generation_time_ms: Date.now() - genStart, generation_time: formatDuration(Date.now() - genStart) });

    written.push(path.resolve(outputPath));
  }

  const metadata = {
    source: "codex-cli",
    prompt,
    params: { n },
    codex: codexMeta,
    image_sizes: imageSizes,
    total_generation_time_ms: Date.now() - totalStart,
    total_generation_time: formatDuration(Date.now() - totalStart),
    written,
    created_at: new Date().toISOString()
  };
  fs.writeFileSync(path.join(dir, "metadata.json"), JSON.stringify(metadata, null, 2));

  return { dir, written };
}

// CLI 入口
const { parseArgs } = await import("./lib/args.mjs");
const { readTextMaybeFile } = await import("./lib/env.mjs");
const args = parseArgs();
const prompt = readTextMaybeFile(args.prompt, args["prompt-file"]);

if (prompt) {
  const saved = await generate({
    prompt,
    name: args.name,
    n: Number(args.n || 1)
  });
  console.log(JSON.stringify(saved, null, 2));
}
