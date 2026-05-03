import { loadDotEnv } from "./lib/env.mjs";
import { createClient, defaultImageOptions, writeImageResult } from "./lib/openai-image.mjs";

export async function generate({ prompt, name, outDir = "gen/outputs", size, quality, format, background, compression, n = 1 }) {
  loadDotEnv();
  const client = createClient();
  const params = { ...defaultImageOptions({ size, quality, format, background, compression }), prompt, n };
  const start = Date.now();
  const result = await client.images.generate(params);
  return writeImageResult({ result, prompt, params, name, outDir, generation_time_ms: Date.now() - start });
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
    size: args.size,
    quality: args.quality,
    format: args.format,
    background: args.background,
    compression: args.compression,
    n: Number(args.n || 1)
  });
  console.log(JSON.stringify(saved, null, 2));
}
