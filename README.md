# tk-GPTImage2

GPT Image 2 提示词研究与生图实验室。基于 Claude Code 的本地工作空间，覆盖从提示词收集、技巧研究、风格沉淀到受控实验的全流程。

## 快速开始

```bash
git clone https://github.com/nekomorph-woo/tk_GPTImage2.git
cd tk_GPTImage2
npm install
cp .env.example .env
```

## 前置条件

### 必需

| 依赖 | 用途 |
|------|------|
| **Node.js >= 20** | 生图脚本运行环境 |
| **Claude Code CLI** | 技能调度和子代理编排 |
| **`npm install`** | 安装 `openai` SDK 和 `undici`（代理下载参考图） |

### 生图方式（至少配一种）

| 方式 | 需要配置 | 说明 |
|------|----------|------|
| **Codex CLI** | 无需配置环境变量 | `npm install -g @openai/codex` + `codex login` 登录 ChatGPT Plus 账号 |
| **OpenAI API 直连** | `.env` 中 `OPENAI_API_KEY` | 使用 OpenAI 官方 API |
| **第三方 API**（如 OpenRouter） | `.env` 中 `OPENAI_API_KEY` + `OPENAI_BASE_URL` | 通过第三方转发使用 GPT Image 2 |

### 可选

| 依赖 | 用途 | 涉及技能 |
|------|------|----------|
| **bb-browser** | 浏览器自动化，X 平台 prompt 收集与提取 | `/collect-image-2-prompt` `/x-to-prompt` `/image-to-prompt` |
| **Python 3** | 去重检查、运行时状态管理等辅助脚本 | `/collect-image-2-prompt` `/x-to-prompt` |
| **X 账号登录** | 在浏览器中登录 x.com | `/collect-image-2-prompt` `/x-to-prompt` `/image-to-prompt` |

### 环境变量参考

```bash
# .env（从 .env.example 复制）
OPENAI_API_KEY=sk-xxx          # API 模式必需
OPENAI_BASE_URL=               # 第三方 API 时填写（如 https://openrouter.ai/api/v1）
OPENAI_IMAGE_MODEL=            # 可选，覆盖默认模型（默认 gpt-image-2）
OPENAI_API_IMAGE_PROXY=        # API 模式的代理（可选）
CODEX_PROXY=http://127.0.0.1:7890  # Codex CLI 代理 + URL 参考图下载代理（可选）
```

代理行为：`CODEX_PROXY` 用于 URL 参考图下载；Codex CLI 生图时有参考图自动直连 OpenAI（避免大请求超时），无参考图时走代理。

## 技能

| 技能 | 说明 |
|------|------|
| `/generate-image` | 单张生图（API 或 Codex CLI），支持参考图 |
| `/controlled-experiment` | 受控变量实验：设计矩阵 → 批量生图 → 自动评分 → 对比结论 |
| `/image-research` | 主题研究：收集素材 → 结构分析 → 提取 recipe → 生图验证 |
| `/collect-image-2-prompt` | 从 X 平台收集 GPT Image 2 提示词 |
| `/iwanna-image-prompt` | 从模糊想法构造完整生图提示词 |
| `/image-to-prompt` | 从 X 博文图片反推生图提示词 |
| `/x-to-prompt` | 从单个 X 推文链接提取文本 prompt |
| `/prepare-collection` | 收集前覆盖度分析 + 搜索词推荐 |

## 生图模式

### API 模式

通过 OpenAI SDK 生图，支持三种子模式：

```bash
# 默认 generate（Images API）
node .claude/skills/generate-image/scripts/api.mjs \
  --prompt "一只橘猫在窗台上看雨" --name cat

# edit 模式（参考图编辑）
node .claude/skills/generate-image/scripts/api.mjs \
  --edit --reference char.png \
  --prompt "将角色放在海滩场景中" --name beach

# Chat Completions 模式（OpenRouter 等第三方）
node .claude/skills/generate-image/scripts/api.mjs \
  --chat --reference char.png \
  --prompt "将角色放在海滩场景中" --name beach
```

### Codex CLI 模式

通过 Codex CLI 内置 `image_gen` 工具生图，消耗 ChatGPT Plus 额度，不需要 API Key：

```bash
# 纯文本生图
node .claude/skills/generate-image/scripts/codex.mjs \
  --prompt "一只橘猫在窗台上看雨" --name cat

# 带参考图（本地路径或网络 URL）
node .claude/skills/generate-image/scripts/codex.mjs \
  --reference gen/z52.jpg \
  --reference "https://pbs.twimg.com/media/xxx.jpg" \
  --prompt "将角色放在温泉场景中" --name onsen
```

所有模式统一输出到 `gen/outputs/<timestamp>-<name>/`（图片 + metadata.json + 参考图副本）。失败时自动清理空输出目录。

代理策略：无参考图走代理（`CODEX_PROXY`），有参考图直连 OpenAI（避免大请求体超时）。URL 参考图始终通过代理下载。

## 项目结构

```
tk_GPTImage2/
├── prompts/                        # 共享提示词资源
│   ├── PROMPT_FRAMEWORK.md         # 十维度提示词框架
│   ├── NEGATIVE_CONSTRAINTS.md     # 按场景的负面约束
│   └── REVIEW_RUBRIC.md            # 7 维度图片评分标准
├── recipes/                        # 稳定风格套路（draft / confirmed）
├── collected/                      # 从外部平台收集的结构化 prompt（100+ 条）
├── gen/outputs/                    # 生图输出（按时间戳+名称分子目录）
├── research/                       # image-research 研究会话
│   ├── sources/                    # 信息源注册表
│   └── studies/                    # 按主题分目录的研究记录
├── GPT_IMAGE2_GRIMOIRE.zh-CN.md    # 完整提示词魔导书
└── .claude/
    ├── skills/                     # 8 个技能定义
    │   ├── generate-image/         #   生图助手（api.mjs + codex.mjs）
    │   ├── controlled-experiment/  #   受控变量实验
    │   ├── image-research/         #   提示词研究
    │   ├── collect-image-2-prompt/ #   X 平台 prompt 收集
    │   ├── iwanna-image-prompt/   #   提示词构造
    │   ├── image-to-prompt/        #   图片反推提示词
    │   ├── x-to-prompt/            #   推文 prompt 提取
    │   └── prepare-collection/     #   收集前准备
    ├── agents/                     # 共享子代理
    │   ├── image-runner.md         #   批量生图（最多 2 并行）
    │   ├── evaluator.md            #   图片评分（7 维度）
    │   ├── collector.md            #   素材收集
    │   └── analyst.md              #   结构分析
    └── rules/                      # 编码规范与对话风格
```

## 工作方式

本项目围绕 Claude Code 的技能和子代理系统构建：

- **技能**定义完整工作流，由主流程编排调度
- **子代理**处理重任务（批量生图、图片评分、素材收集、结构分析），保持主上下文清洁
- `/controlled-experiment` 和 `/image-research` 共享 `image-runner` 和 `evaluator` 两个子代理
- 生图脚本（`api.mjs`、`codex.mjs`）可直接从命令行调用，也可被技能自动调度

## 许可

Private — 仅供个人研究使用。
