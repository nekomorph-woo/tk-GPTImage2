import { parseArgs } from "./lib/args.mjs";
import { loadDotEnv, readTextMaybeFile } from "./lib/env.mjs";
import { createClient, defaultImageOptions, writeImageResult } from "./lib/openai-image.mjs";

loadDotEnv();

const args = parseArgs();
const prompt = readTextMaybeFile(args.prompt, args["prompt-file"]);

if (!prompt) {
  throw new Error("请提供 --prompt \"...\" 或 --prompt-file path/to/prompt.md");
}

const client = createClient();
const params = {
  ...defaultImageOptions(args),
  prompt,
  n: Number(args.n || 1)
};

const result = await client.images.generate(params);
const saved = await writeImageResult({
  result,
  prompt,
  params,
  name: args.name
});

console.log(JSON.stringify(saved, null, 2));
