import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { ensureDir, slugify, timestamp } from "./env.mjs";

export function createClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("缺少 OPENAI_API_KEY。请先根据 .env.example 创建 .env。");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export function defaultImageOptions(overrides = {}) {
  const options = {
    model: overrides.model || process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
    size: overrides.size || process.env.OPENAI_IMAGE_SIZE || "1024x1024",
    quality: overrides.quality || process.env.OPENAI_IMAGE_QUALITY || "medium",
    output_format: overrides.format || "png"
  };

  if (overrides.background) options.background = overrides.background;
  if (overrides.compression) options.output_compression = Number(overrides.compression);

  return options;
}

export async function writeImageResult({ result, prompt, params, name, outDir = "outputs" }) {
  const runId = `${timestamp()}-${slugify(name || prompt.slice(0, 48))}`;
  const dir = path.join(outDir, runId);
  ensureDir(dir);

  const written = [];
  for (const [index, item] of result.data.entries()) {
    if (!item.b64_json) continue;
    const imagePath = path.join(dir, `${String(index + 1).padStart(2, "0")}.png`);
    fs.writeFileSync(imagePath, Buffer.from(item.b64_json, "base64"));
    written.push(imagePath);
  }

  fs.writeFileSync(
    path.join(dir, "metadata.json"),
    JSON.stringify({ prompt, params, written, created_at: new Date().toISOString() }, null, 2)
  );

  return { dir, written };
}
