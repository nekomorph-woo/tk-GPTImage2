import fs from "node:fs";
import { parseArgs, requireArg } from "./lib/args.mjs";
import { loadDotEnv } from "./lib/env.mjs";
import { createClient, defaultImageOptions, writeImageResult } from "./lib/openai-image.mjs";

loadDotEnv();

const args = parseArgs();
const matrixPath = requireArg(args, "matrix", "请提供 --matrix gen/experiments/starter.json");
const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8"));
const client = createClient();

const base = matrix.base || {};
const runs = matrix.runs || [];

for (const [index, run] of runs.entries()) {
  const prompt = [base.prompt, run.prompt].filter(Boolean).join("\n\n").trim();
  const params = {
    ...defaultImageOptions({ ...base, ...run }),
    prompt,
    n: Number(run.n || base.n || 1)
  };
  console.log(`正在运行 ${index + 1}/${runs.length}: ${run.name || "未命名"}`);
  const result = await client.images.generate(params);
  const saved = await writeImageResult({
    result,
    prompt,
    params,
    name: run.name || `batch-${index + 1}`
  });
  console.log(JSON.stringify(saved, null, 2));
}
