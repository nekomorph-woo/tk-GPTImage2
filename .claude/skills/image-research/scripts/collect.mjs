import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "./lib/args.mjs";
import { ensureDir, timestamp } from "./lib/env.mjs";

const args = parseArgs();
const sourceFile = args.sources || "sources/gpt-image2-public-sources.json";
const sources = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

ensureDir("studies/collections");

const lines = [
  "# GPT Image2 收集运行",
  "",
  `创建时间：${new Date().toISOString()}`,
  "",
  "这个文件是公开提示词研究队列，用来记录下一步研究哪些来源，以及如何处理每个来源。",
  "",
  "## 来源",
  ""
];

for (const source of sources) {
  lines.push(`### ${source.name}`);
  lines.push("");
  lines.push(`- URL: ${source.url}`);
  lines.push(`- 类型：${source.type}`);
  lines.push(`- 可信度：${source.trust}`);
  lines.push(`- 笔记：${source.notes}`);
  lines.push("- 提取目标：可复用提示词结构、风格类别、失败模式；不长段逐字复制。");
  lines.push("");
}

lines.push("## 提取检查清单");
lines.push("");
lines.push("- 这是什么图片类别？");
lines.push("- 它使用了什么提示词框架？");
lines.push("- 它包含哪些构图、光线、材质、色彩和文字控制？");
lines.push("- 哪些内容可以变成可复用 recipe？");
lines.push("- 哪些风险需要规避或验证？");
lines.push("");

const output = path.join("studies/collections", `${timestamp()}-source-queue.md`);
fs.writeFileSync(output, `${lines.join("\n")}\n`);
console.log(output);
