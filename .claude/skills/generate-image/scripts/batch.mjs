import fs from "node:fs";
import { parseArgs, requireArg } from "./lib/args.mjs";

const args = parseArgs();
const mode = args.mode || "api";
const matrixPath = requireArg(args, "matrix", "请提供 --matrix gen/experiments/starter.json");

if (mode !== "api" && mode !== "codex") {
  throw new Error(`无效的 --mode "${mode}"，仅支持 api 或 codex`);
}

const { generate } = await import(`./${mode}.mjs`);

const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8"));
const base = matrix.base || {};
const runs = matrix.runs || [];

for (const [index, run] of runs.entries()) {
  const prompt = [base.prompt, run.prompt].filter(Boolean).join("\n\n").trim();
  const name = run.name || `batch-${index + 1}`;

  console.log(`[${mode}] 正在运行 ${index + 1}/${runs.length}: ${name}`);

  const saved = await generate({
    prompt,
    name,
    size: run.size || base.size,
    quality: run.quality || base.quality,
    format: run.format || base.format,
    background: run.background || base.background,
    compression: run.compression || base.compression,
    n: Number(run.n || base.n || 1)
  });

  console.log(JSON.stringify(saved, null, 2));
}

console.log(`\n全部 ${runs.length} 个实验完成（模式: ${mode}）`);
