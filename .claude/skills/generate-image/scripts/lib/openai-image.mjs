import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import OpenAI from "openai";
import { ensureDir, slugify, timestamp } from "./env.mjs";

export async function createClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("缺少 OPENAI_API_KEY。请先根据 .env.example 创建 .env。");
  }
  const options = { apiKey: process.env.OPENAI_API_KEY };
  if (process.env.OPENAI_BASE_URL) options.baseURL = process.env.OPENAI_BASE_URL;

  const proxy = process.env.OPENAI_API_IMAGE_PROXY;
  if (proxy) {
    const { ProxyAgent, fetch } = await import("undici");
    options.fetch = (url, init) => fetch(url, { ...init, dispatcher: new ProxyAgent(proxy) });
  }

  return new OpenAI(options);
}

export function defaultImageOptions(overrides = {}) {
  const options = {
    model: overrides.model || process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
    quality: overrides.quality || process.env.OPENAI_IMAGE_QUALITY || "medium",
    output_format: overrides.format || "png"
  };

  if (overrides.size) options.size = overrides.size;
  else if (process.env.OPENAI_IMAGE_SIZE) options.size = process.env.OPENAI_IMAGE_SIZE;

  if (overrides.background) options.background = overrides.background;
  if (overrides.compression) options.output_compression = Number(overrides.compression);

  return options;
}

export function formatDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  if (totalSec >= 60) return `${Math.floor(totalSec / 60)}分${totalSec % 60}秒`;
  return `${totalSec}秒`;
}

export function getImageDimensions(filePath) {
  const output = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`, { encoding: "utf8" });
  const w = output.match(/pixelWidth:\s*(\d+)/)?.[1];
  const h = output.match(/pixelHeight:\s*(\d+)/)?.[1];
  return { width: Number(w), height: Number(h) };
}

export async function writeImageResult({ result, prompt, params, name, outDir = "outputs", generation_time_ms, references = [] }) {
  const runId = `${timestamp()}-${slugify(name || prompt.slice(0, 48))}`;
  const dir = path.join(outDir, runId);
  ensureDir(dir);

  const written = [];
  const imageSizes = [];
  for (const [index, item] of result.data.entries()) {
    if (!item.b64_json) continue;
    const imagePath = path.join(dir, `${String(index + 1).padStart(2, "0")}.png`);
    fs.writeFileSync(imagePath, Buffer.from(item.b64_json, "base64"));
    written.push(imagePath);
    imageSizes.push(getImageDimensions(imagePath));
  }

  const copied = [];
  for (const ref of references) {
    const dest = path.join(dir, `ref-${path.basename(ref)}`);
    fs.copyFileSync(ref, dest);
    copied.push(dest);
  }

  const metadata = { prompt, params, generation_time_ms, generation_time: formatDuration(generation_time_ms), image_sizes: imageSizes, written, created_at: new Date().toISOString() };
  if (copied.length) metadata.references = copied;
  fs.writeFileSync(path.join(dir, "metadata.json"), JSON.stringify(metadata, null, 2));

  return { dir, written };
}

export function editOptions({ prompt, references, model, quality, format, compression } = {}) {
  if (!references?.length) throw new Error("edit 模式需要至少一个 --reference 参考图");
  const options = {
    image: references.map(ref => fs.createReadStream(ref)),
    prompt,
    model: model || process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
    quality: quality || "medium",
    output_format: format || "png",
    input_fidelity: "high"
  };
  if (compression) options.output_compression = Number(compression);
  return options;
}
