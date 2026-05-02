---
name: generate-image
description: 生成单张图片、Codex CLI 生图（无需 API Key）。Use when 用户要求生成图片、ChatGPT 生图、Codex 生图、"帮我生成..."、"用 Codex 生成..."。
---

# 生图助手

## 架构

```
scripts/
├── api.mjs      ← API 生图器，导出 generate()
└── codex.mjs    ← Codex CLI 生图器，导出 generate()

lib/
├── args.mjs            ← 命令行参数解析（共用）
├── env.mjs             ← 环境变量、文件工具（共用）
└── openai-image.mjs    ← OpenAI SDK 工具（仅 api.mjs）
```

## 前置检查

**API 模式**：`npm install` 已执行 + `.env` 包含 `OPENAI_API_KEY`

**Codex CLI 模式**：`npm install -g @openai/codex` 已安装 + `codex login` 已登录 ChatGPT Plus

确认用户是否有 API 预算 — 没有预算时优先使用 Codex CLI 模式。

## 工作流

### 1. 选择脚本

| 需求 | 脚本 |
|------|------|
| 单张生成（API） | `api.mjs` |
| 单张生成（Codex） | `codex.mjs` |

> 批量生图请使用 `/controlled-experiment`（自动设计实验矩阵 + 评分 + 结论）。

### 2. 构造提示词

用户未提供提示词时参考 [references/prompt-guide.md](references/prompt-guide.md)。

### 3. 执行

最简示例：

```bash
# API
node .claude/skills/generate-image/scripts/api.mjs --prompt "一只橘猫在窗台上看雨" --name cat

# Codex
node .claude/skills/generate-image/scripts/codex.mjs --prompt "一只橘猫在窗台上看雨" --name cat
```

完整命令、参数表见 [references/commands.md](references/commands.md)。

### 4. 报告

只报告输出文件路径，**不要显示图片**。

## 输出

所有模式统一输出到 `gen/outputs/<timestamp>-<name>/`（图片 + metadata.json）。

## 约束

1. 不要显示图片
2. 提示词遵循框架，不堆叠模糊质量词
3. 中文海报精确标题放引号内，声明"不要额外随机文字"
4. Codex 模式固定输出 1254x1254，`--size` 是后处理缩放
