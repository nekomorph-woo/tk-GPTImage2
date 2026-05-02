import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "./lib/args.mjs";
import { ensureDir, readTextMaybeFile, slugify, timestamp } from "./lib/env.mjs";

const args = parseArgs();
const prompt = readTextMaybeFile(args.prompt, args["prompt-file"]);
const experimentPath = args.matrix;

ensureDir("chatgpt-queue");

const runId = `${timestamp()}-${slugify(args.name || "chatgpt-queue")}`;
const output = path.join("chatgpt-queue", `${runId}.md`);

const lines = [
  "# ChatGPT 生图队列",
  "",
  `创建时间：${new Date().toISOString()}`,
  "",
  "当你希望通过 ChatGPT Plus 生图，而不是通过 OpenAI API 消耗单独账单时，使用这个队列。",
  "",
  "工作流：",
  "",
  "1. 打开 ChatGPT 生图。",
  "2. 每次粘贴一个提示词块。",
  "3. 下载生成的图片。",
  "4. 把下载图片放入一个本地文件夹。",
  "5. 使用 `npm run chatgpt:import -- --from path/to/folder --name run-name` 导回工作台。",
  ""
];

if (experimentPath) {
  const matrix = JSON.parse(fs.readFileSync(experimentPath, "utf8"));
  const basePrompt = matrix.base?.prompt || "";
  lines.push("## 实验矩阵");
  lines.push("");
  lines.push(`来源：\`${experimentPath}\``);
  lines.push("");
  for (const [index, run] of (matrix.runs || []).entries()) {
    const mergedPrompt = [basePrompt, run.prompt].filter(Boolean).join("\n\n").trim();
    lines.push(`### ${index + 1}. ${run.name || `run-${index + 1}`}`);
    lines.push("");
    lines.push("```text");
    lines.push(mergedPrompt);
    lines.push("```");
    lines.push("");
  }
} else if (prompt) {
  lines.push("## 提示词");
  lines.push("");
  lines.push("```text");
  lines.push(prompt);
  lines.push("```");
  lines.push("");
} else {
  throw new Error("请提供 --prompt、--prompt-file 或 --matrix");
}

fs.writeFileSync(output, `${lines.join("\n")}\n`);
console.log(output);
