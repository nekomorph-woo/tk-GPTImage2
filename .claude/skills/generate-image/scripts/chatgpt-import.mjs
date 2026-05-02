import fs from "node:fs";
import path from "node:path";
import { parseArgs, requireArg } from "./lib/args.mjs";
import { ensureDir, slugify, timestamp } from "./lib/env.mjs";

const args = parseArgs();
const from = requireArg(args, "from", "请提供 --from path/to/downloaded/images");
const sourceDir = path.resolve(from);

if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
  throw new Error(`不是有效文件夹：${sourceDir}`);
}

const imageExts = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const files = fs.readdirSync(sourceDir)
  .filter((file) => imageExts.has(path.extname(file).toLowerCase()))
  .sort();

if (files.length === 0) {
  throw new Error(`在 ${sourceDir} 中没有找到图片文件`);
}

const runId = `${timestamp()}-${slugify(args.name || path.basename(sourceDir))}`;
const outputDir = path.join("outputs", "chatgpt", runId);
ensureDir(outputDir);

const copied = [];
for (const [index, file] of files.entries()) {
  const ext = path.extname(file).toLowerCase();
  const dest = path.join(outputDir, `${String(index + 1).padStart(2, "0")}${ext}`);
  fs.copyFileSync(path.join(sourceDir, file), dest);
  copied.push({ source: path.join(sourceDir, file), output: dest });
}

fs.writeFileSync(
  path.join(outputDir, "metadata.json"),
  JSON.stringify({
    source: "chatgpt-manual",
    imported_at: new Date().toISOString(),
    source_dir: sourceDir,
    copied,
    notes: args.notes || ""
  }, null, 2)
);

console.log(outputDir);
