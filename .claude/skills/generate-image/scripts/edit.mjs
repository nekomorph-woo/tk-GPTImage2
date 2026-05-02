import fs from "node:fs";
import { toFile } from "openai";
import { parseArgs, requireArg } from "./lib/args.mjs";
import { loadDotEnv, readTextMaybeFile } from "./lib/env.mjs";
import { createClient, defaultImageOptions, writeImageResult } from "./lib/openai-image.mjs";

loadDotEnv();

const args = parseArgs();
const imagePath = requireArg(args, "image", "请提供 --image inputs/refs/example.png");
const prompt = readTextMaybeFile(args.prompt, args["prompt-file"]);

if (!prompt) {
  throw new Error("请提供 --prompt \"...\" 或 --prompt-file path/to/prompt.md");
}

const client = createClient();
const imagePaths = imagePath.split(",").map((item) => item.trim()).filter(Boolean);
const image = imagePaths.length === 1
  ? fs.createReadStream(imagePaths[0])
  : await Promise.all(
      imagePaths.map((file) => toFile(fs.createReadStream(file), null, { type: "image/png" }))
    );
const params = {
  ...defaultImageOptions(args),
  prompt,
  image,
  n: Number(args.n || 1)
};

if (args.mask) params.mask = fs.createReadStream(args.mask);

const result = await client.images.edit(params);
const saved = await writeImageResult({
  result,
  prompt,
  params: { ...params, image: imagePaths, mask: args.mask || null },
  name: args.name || "编辑"
});

console.log(JSON.stringify(saved, null, 2));
