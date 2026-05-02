# tk_GPTImage2

GPT Image 2 提示词研究与生图实验室。基于 Claude Code 的本地工作空间，覆盖从提示词收集、技巧研究、风格沉淀到受控实验的全流程。

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/nekomorph-woo/tk_GPTImage2.git
cd tk_GPTImage2

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY
```

**前置条件**：Node.js >= 20、Claude Code CLI。

## 技能

| 技能 | 说明 |
|------|------|
| `/generate-image` | 单张生图（API 或 Codex CLI） |
| `/controlled-experiment` | 受控变量实验：设计矩阵 → 批量生图 → 自动评分 → 对比结论 |
| `/image-research` | 主题研究：收集素材 → 结构分析 → 提取 recipe → 生图验证 |
| `/collect-image-2-prompt` | 从 X 平台收集 GPT Image 2 提示词 |

## 项目结构

```
tk_GPTImage2/
├── prompts/                    # 共享提示词资源
│   ├── PROMPT_FRAMEWORK.md     # 标准提示词结构
│   ├── NEGATIVE_CONSTRAINTS.md # 失败规避短语
│   └── REVIEW_RUBRIC.md        # 7 维评分标准
├── recipes/                    # 稳定风格套路（draft / confirmed）
├── collected/                  # 从外部平台收集的结构化 prompt
├── gen/outputs/                # 生图输出（按时间戳+名称分子目录）
├── research/                   # image-research 研究会话
│   ├── sources/                # 信息源注册表
│   └── studies/                # 按主题分目录的研究记录
├── experiments/                # controlled-experiment 实验产出
├── GPT_IMAGE2_GRIMOIRE.zh-CN.md  # 完整提示词魔导书
└── .claude/
    ├── skills/                 # 4 个技能定义
    └── agents/                 # 共享 subagents
        ├── image-runner.md     # 批量生图（最多 2 并行）
        ├── evaluator.md        # 图片评分（7 维度）
        ├── collector.md        # 素材收集
        └── analyst.md          # 结构分析
```

## 工作方式

本项目围绕 Claude Code 的技能（Skills）和子代理（Agents）系统构建：

- **技能**定义完整工作流，由主流程编排调度
- **子代理**处理重任务（批量生图、图片评分、素材收集、结构分析），保持主上下文清洁
- `/controlled-experiment` 和 `/image-research` 共享 `image-runner`（生图）和 `evaluator`（评分）两个子代理

## 许可

Private — 仅供个人研究使用。
