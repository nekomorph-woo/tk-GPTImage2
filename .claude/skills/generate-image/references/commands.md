# 命令参考

所有命令从项目根目录执行。

## api.mjs — 单张生成（API）

```bash
node .claude/skills/generate-image/scripts/api.mjs \
  --prompt "创建一张高级产品海报..." \
  --name product-test

# 使用提示词文件
node .claude/skills/generate-image/scripts/api.mjs \
  --prompt-file prompts/my-prompt.md \
  --name product-test
```

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

## codex.mjs — 单张生成（Codex CLI）

通过 Codex CLI 内置 image_gen 工具生成图片（使用 ChatGPT Plus 订阅，不需要 API key）。

```bash
# 基本用法
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt "创建一张高级产品海报..." \
  --name codex-test

# 使用提示词文件
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt-file prompts/my-prompt.md \
  --name codex-test

# 多张生成
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt "创建一张高级产品海报..." \
  --name codex-test --n 3

# 指定尺寸（Codex 固定输出 1254x1254，通过 sips 后处理缩放）
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt "创建一张竖版海报..." \
  --name codex-test --size 1024x1536
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--prompt` | 二选一 | 直接提供提示词文本 |
| `--prompt-file` | 二选一 | 提示词文件路径 |
| `--name` | 否 | 运行名称，用于输出目录命名 |
| `--size` | 否 | 目标尺寸（Codex 固定输出 1254x1254，通过 sips 后处理缩放） |
| `--n` | 否 | 生成数量，默认 1 |

不需要 `OPENAI_API_KEY`。Codex 可能对 prompt 进行额外增强（augment），实际生成的图片可能与原始 prompt 有差异。单次调用最长等待 10 分钟。

## batch.mjs — 批量实验

纯编排层，通过 `--mode` 选择生图器（默认 api）。

```bash
# 先从模板复制一份到 gen/experiments/，再修改
cp .claude/skills/generate-image/references/starter-template.json gen/experiments/my-experiment.json

# API 模式（默认）
node .claude/skills/generate-image/scripts/batch.mjs \
  --matrix gen/experiments/my-experiment.json

# Codex CLI 模式
node .claude/skills/generate-image/scripts/batch.mjs \
  --mode codex \
  --matrix gen/experiments/my-experiment.json
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--matrix` | 是 | 实验矩阵 JSON 路径 |
| `--mode` | 否 | 生图模式：`api`（默认）或 `codex` |

### 实验矩阵格式

```json
{
  "base": {
    "prompt": "基础提示词（所有 run 共享）",
    "size": "1024x1024",
    "quality": "medium"
  },
  "runs": [
    { "name": "实验名称", "prompt": "追加/覆盖的提示词", "n": 2 },
    { "name": "实验名称", "size": "1536x1024" }
  ]
}
```

每个 run 把 `base` 和自身字段合并后独立生成图片。

### 模板一：Starter（多风格快速试跑）

`references/starter-template.json`

适合场景：你想快速看同一模型下不同提示词风格的生成效果。

设计思路：`base` 只设模型和尺寸，不设 prompt。每个 `run` 携带完整的独立提示词（电影剧照、产品海报、中文编辑海报），互不依赖。相当于"跑 3 张不同风格的图"。

```json
{
  "base": { "model": "gpt-image-2", "size": "1024x1024", "quality": "medium", "n": 1 },
  "runs": [
    { "name": "cinematic-grounded-print-studio", "prompt": "创建一张电影剧照：..." },
    { "name": "premium-product-audio",            "prompt": "创建一张高级产品海报：..." },
    { "name": "chinese-editorial-city-wind",      "prompt": "创建一张竖版高级中文编辑海报..." }
  ]
}
```

### 模板二：Axis Lab（单变量对照实验）

`references/axis-lab-template.json`

适合场景：你想控制变量，测试"只改一个维度"对生成效果的影响。

设计思路：`base` 携带完整的主体描述（设计师桌面 AI 工作站），所有 run 共享同一个画面主题。每个 `run` 只追加一个维度的描述（构图俯拍 vs 低机位、电影剧照风格 vs App 宣传风格），保证对比有意义。这是批量实验的核心原则——一次只改一个变量。

```json
{
  "base": {
    "model": "gpt-image-2",
    "size": "1024x1024",
    "quality": "low",
    "n": 1,
    "prompt": "创建一张高级编辑视觉：设计师桌面上的小型 AI 生图工作站。..."
  },
  "runs": [
    { "name": "axis-composition-overhead",       "prompt": "构图：俯拍 flat-lay..." },
    { "name": "axis-composition-low-angle",      "prompt": "构图：低机位三分之四视角..." },
    { "name": "axis-style-cinematic",            "prompt": "视觉语言：真实克制的电影剧照..." },
    { "name": "axis-style-productivity-ui",      "prompt": "视觉语言：精致生产力 App 宣传视觉..." }
  ]
}
```

这个模板里 4 个 run 分两组对照：
- **构图变量组**：overhead（俯拍）vs low-angle（低机位）— 相同主体，只换角度
- **风格变量组**：cinematic（电影剧照）vs productivity-ui（App 宣传）— 相同主体，只换视觉语言
