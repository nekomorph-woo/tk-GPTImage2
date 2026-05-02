import fs from "node:fs";
import { loadDotEnv } from "./lib/env.mjs";

loadDotEnv();

const checks = [
  ["package.json", fs.existsSync("package.json")],
  [".env 或 OPENAI_API_KEY", Boolean(process.env.OPENAI_API_KEY || fs.existsSync(".env"))],
  ["recipes/recipes.json", fs.existsSync("recipes/recipes.json")],
  ["prompts/PROMPT_FRAMEWORK.md", fs.existsSync("prompts/PROMPT_FRAMEWORK.md")]
];

for (const [name, ok] of checks) {
  console.log(`${ok ? "OK" : "缺失"} ${name}`);
}

if (!process.env.OPENAI_API_KEY) {
  console.log("尚未加载 OPENAI_API_KEY。配置 .env 前，生成图片命令会失败。");
}
