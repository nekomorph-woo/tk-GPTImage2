import fs from "node:fs";
import { execSync } from "node:child_process";
import { loadDotEnv } from "./lib/env.mjs";

loadDotEnv();

const checks = [
  { name: "Node.js >= 20", ok: checkNodeVersion() },
  { name: "node_modules/（npm install）", ok: fs.existsSync("node_modules") },
  { name: "OPENAI_API_KEY", ok: Boolean(process.env.OPENAI_API_KEY) },
  { name: "Codex CLI", ok: checkCodex() },
  { name: "prompts/PROMPT_FRAMEWORK.md", ok: fs.existsSync("prompts/PROMPT_FRAMEWORK.md") },
  { name: "prompts/NEGATIVE_CONSTRAINTS.md", ok: fs.existsSync("prompts/NEGATIVE_CONSTRAINTS.md") },
  { name: "prompts/REVIEW_RUBRIC.md", ok: fs.existsSync("prompts/REVIEW_RUBRIC.md") },
  { name: "GPT_IMAGE2_GRIMOIRE.zh-CN.md", ok: fs.existsSync("GPT_IMAGE2_GRIMOIRE.zh-CN.md") },
  { name: "recipes/（风格套路目录）", ok: fs.existsSync("recipes") },
  { name: "research/sources/（信息源目录）", ok: fs.existsSync("research/sources") },
  { name: "collected/（收集目录）", ok: fs.existsSync("collected") },
];

const failures = [];

for (const { name, ok } of checks) {
  const label = ok ? "OK" : "缺失";
  console.log(`  ${label}  ${name}`);
  if (!ok) failures.push(name);
}

if (failures.length === 0) {
  console.log("\n✅ 全部通过");
} else {
  console.log(`\n⚠️  ${failures.length} 项缺失: ${failures.join(", ")}`);
}

function checkNodeVersion() {
  try {
    const v = process.version.replace("v", "").split(".")[0];
    return Number(v) >= 20;
  } catch {
    return false;
  }
}

function checkCodex() {
  try {
    execSync("codex --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}
