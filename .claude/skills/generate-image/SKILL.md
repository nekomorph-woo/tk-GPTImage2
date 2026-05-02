---
name: generate-image
description: 生成单张图片、运行批量实验、参考图编辑、ChatGPT Plus 提示词队列模式、导入 ChatGPT 下载图片。Use when 用户要求生成图片、批量测试提示词、编辑参考图、ChatGPT 生图、"帮我生成..."、"批量..."、"编辑这张图..."。
---

# 生图助手

使用本技能生成、编辑和管理 GPT Image 2 图片。

## 前置检查

执行任何 API 调用前，确认：

1. 项目根目录下已执行 `npm install`（openai SDK 可用）
2. `.env` 文件存在且包含 `OPENAI_API_KEY`（API 模式需要）
3. 如果用户没有 API 预算，使用 ChatGPT 模式

可用健康检查：

```bash
node .claude/skills/image-research/scripts/doctor.mjs
```

## 工作流

### 步骤 1：理解用户需求

识别图片类型（海报、产品图、角色、电影场景、图标等）和输出要求（尺寸、质量、数量）。确认用户是否有 API 预算。

### 步骤 2：选择合适的脚本

| 需求 | 脚本 |
|------|------|
| 单张生成 | `generate.mjs` |
| 批量实验 | `batch.mjs` |
| 参考图编辑 | `edit.mjs` |
| ChatGPT 提示词队列 | `chatgpt-queue.mjs` |
| 导入 ChatGPT 图片 | `chatgpt-import.mjs` |

### 步骤 3：构造参数

如果用户没有指定提示词：
1. 读取 `recipes/recipes.json` 找到匹配的配方
2. 或读取 `prompts/prompt-cards/` 下的对应卡片
3. 参考 `prompts/PROMPT_FRAMEWORK.md` 构造完整提示词

### 步骤 4：执行并报告

通过 Bash 执行脚本，只报告输出文件路径，**不要尝试显示图片**。

## 命令参考

所有命令从项目根目录执行。

### 单张生成

```bash
node .claude/skills/generate-image/scripts/generate.mjs \
  --prompt "创建一张高级产品海报..." \
  --name product-test
```

使用提示词卡片：

```bash
node .claude/skills/generate-image/scripts/generate.mjs \
  --prompt-file prompts/prompt-cards/product-poster.md \
  --name product-test
```

### 批量实验

```bash
node .claude/skills/generate-image/scripts/batch.mjs \
  --matrix gen/experiments/starter.json
```

### 参考图编辑

```bash
node .claude/skills/generate-image/scripts/edit.mjs \
  --image gen/inputs/refs/example.png \
  --prompt "保留主体和构图，把光线改成高级编辑棚拍风格。" \
  --name edit-test
```

多个参考图（逗号分隔）：

```bash
node .claude/skills/generate-image/scripts/edit.mjs \
  --image gen/inputs/refs/product.png,gen/inputs/refs/material.png \
  --prompt "保留第一张图的产品形状，使用第二张图的材质语言。"
```

### ChatGPT Plus 提示词队列

从实验矩阵创建：

```bash
node .claude/skills/generate-image/scripts/chatgpt-queue.mjs \
  --matrix gen/experiments/starter.json --name starter
```

从提示词创建：

```bash
node .claude/skills/generate-image/scripts/chatgpt-queue.mjs \
  --prompt-file prompts/prompt-cards/product-poster.md --name product-poster
```

### 导入 ChatGPT 下载图片

```bash
node .claude/skills/generate-image/scripts/chatgpt-import.mjs \
  --from ~/Downloads/chatgpt-images --name starter
```

## 参数说明

### generate.mjs

| 参数 | 必填 | 说明 |
|------|------|------|
| `--prompt` | 二选一 | 直接提供提示词文本 |
| `--prompt-file` | 二选一 | 提示词文件路径 |
| `--name` | 否 | 运行名称，用于输出目录命名 |
| `--size` | 否 | 图片尺寸，默认 1024x1024 |
| `--quality` | 否 | low/medium/high，默认 medium |
| `--format` | 否 | png/jpeg/webp，默认 png |
| `--compression` | 否 | JPEG 压缩质量 0-100 |
| `--background` | 否 | 背景处理 |
| `--n` | 否 | 同一提示词生成数量，默认 1 |

### batch.mjs

| 参数 | 必填 | 说明 |
|------|------|------|
| `--matrix` | 是 | 实验矩阵 JSON 路径 |

实验矩阵 JSON 格式参考 `gen/experiments/starter.json` 和 `gen/experiments/axis-lab.json`。

### edit.mjs

| 参数 | 必填 | 说明 |
|------|------|------|
| `--image` | 是 | 参考图路径，多图用逗号分隔 |
| `--prompt` / `--prompt-file` | 二选一 | 编辑指令 |
| `--mask` | 否 | 遮罩图路径 |
| `--name` | 否 | 运行名称 |
| `--n` | 否 | 生成数量 |

### chatgpt-queue.mjs

| 参数 | 必填 | 说明 |
|------|------|------|
| `--prompt` / `--prompt-file` | 二选一 | 提示词（与 --matrix 二选一） |
| `--matrix` | 二选一 | 实验矩阵 JSON 路径 |
| `--name` | 否 | 队列名称 |

### chatgpt-import.mjs

| 参数 | 必填 | 说明 |
|------|------|------|
| `--from` | 是 | 下载图片的文件夹路径 |
| `--name` | 否 | 运行名称 |
| `--notes` | 否 | 备注信息 |

## 提示词构造指南

当用户没有提供完整提示词时，按以下优先级参考：

1. `prompts/prompt-cards/` — 可复用提示词卡片（5 张现成卡片）
2. `recipes/recipes.json` — 稳定风格套路（5 个配方）
3. `prompts/PROMPT_FRAMEWORK.md` — 标准提示词结构
4. `prompts/NEGATIVE_CONSTRAINTS.md` — 失败规避短语
5. `GPT_IMAGE2_GRIMOIRE.zh-CN.md` — 完整魔导书（8 大流派）
6. `references/prompt-recipes.md` — 提示词配方参考与诊断

核心公式：

```text
创建一张[格式]，主体是[主体]。
构图：[镜头/裁切/布局]。
视觉语言：[风格锚点]。
光线：[光线]。
材质与细节：[材质]。
色彩：[调色板]。
文字：[精确文字与位置，或"无文字"]。
质量约束：[具体失败规避]。
```

## 输出路径

| 操作 | 输出位置 |
|------|----------|
| API 生成/编辑 | `gen/outputs/<timestamp>-<name>/`（图片 + metadata.json） |
| ChatGPT 队列 | `gen/chatgpt-queue/<timestamp>-<name>.md` |
| ChatGPT 导入 | `gen/outputs/chatgpt/<timestamp>-<name>/`（图片 + metadata.json） |

## 约束

1. **不要显示图片** — 只报告输出文件路径
2. **提示词遵循框架** — 不要堆叠"masterpiece, ultra detailed"等模糊质量词
3. **一次只改一个变量** — 批量实验的核心原则
4. **参考图路径相对项目根目录** — 使用 `gen/inputs/refs/...` 格式
5. **中文海报文字规则** — 精确中文标题放引号内，声明"不要额外随机文字"
6. **编辑图保留说明** — 必须写清保留什么、改变什么、不动什么
