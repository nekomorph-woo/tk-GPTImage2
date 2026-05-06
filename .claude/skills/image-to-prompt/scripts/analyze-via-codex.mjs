#!/usr/bin/env node

// 通过 codex CLI 分析图片，输出反推用的详细描述
// 用法: node analyze-via-codex.mjs <图片路径>
// 输出: codex CLI 的图片分析文本（stdout），错误信息（stderr）

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const imgPath = process.argv[2];
if (!imgPath) {
  process.exit(1);
}

if (!fs.existsSync(imgPath)) {
  process.exit(1);
}

const prompt = `Describe this image in detail for the purpose of writing a reproduction prompt. Cover all 10 elements: 1) Subject identity and pose 2) Hair style color and accessories 3) Eye shape and color 4) Facial expression 5) Clothing design and materials 6) Lighting direction and quality 7) Background elements 8) Color palette 9) Art style and rendering technique 10) Composition and framing. Output only the description, no preamble.`;

try {
  const result = execSync(
    `echo ${JSON.stringify(prompt)} | codex exec -i ${JSON.stringify(imgPath)}`,
    {
      timeout: 180000,
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf8",
    }
  );

  // 从 codex 输出中提取描述（跳过 header 行）
  const lines = result.split("\n");
  const descStart = lines.findIndex((l) => /^[A-Z]/.test(l.trim()) && l.trim().length > 50);
  if (descStart >= 0) {
    process.stdout.write(lines.slice(descStart).join("\n").trim() + "\n");
  } else {
    process.stdout.write(result.trim() + "\n");
  }
} catch (err) {
  process.exit(1);
}
