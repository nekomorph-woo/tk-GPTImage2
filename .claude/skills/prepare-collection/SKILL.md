---
name: prepare-collection
description: 收集前的准备技能：分析覆盖度、推荐搜索词、生成 Ralph-loop 收集指令。Use when 用户要求分析已收集 prompt 覆盖度、推荐搜索词、生成收集指令，或提到 "准备收集"、"搜索词"、"分析覆盖"、"生成指令"。
---

# 收集准备

`/collect-image-2-prompt` 的前置技能，负责状态分析、搜索词构想和指令生成。

## 意图识别

根据用户输入路由到不同模块：

| 意图 | 触发词 | 执行 |
|------|--------|------|
| 搜索词构想 | "推荐搜索词"、"分析覆盖"、"搜什么" | 模块 1 + 2 |
| 指令生成 | "生成指令"、"ralph-loop"、"开始收集"、"准备收集" | 模块 1 + 3 |
| 完整准备 | 未明确指定 | 模块 1 + 2 + 3 |

## 脚本

- [scripts/coverage-analysis.py](scripts/coverage-analysis.py) — 覆盖度分析 + 推荐算法 + 指令推算
  - 无参数 → 覆盖度报告（分组展示低覆盖领域）
  - `--sample` → 分组随机抽样 gap（供 LLM 推荐，33 条左右）
  - `--suggest "搜索词" 数量` → JSON 推算结果（去重判断、时间衰减排序、max-iterations、完整命令）
- [reference/search-categories.md](reference/search-categories.md) — GPT Image 2 常见应用类别

## 模块 1：状态分析（自动）

```
python3 .claude/skills/prepare-collection/scripts/coverage-analysis.py
```

输出覆盖度报告：已收集/已跳过/跳过率、搜索词历史、标签 TOP 15、作者 TOP 10、低覆盖领域。

## 模块 2：搜索词构想（分组抽样 + LLM 推荐）

1. 调用 `--sample` 获取分组随机抽样的覆盖缺口：

```
python3 .claude/skills/prepare-collection/scripts/coverage-analysis.py --sample
```

2. LLM 输出 10 个推荐搜索词，直接以表格形式展示到控制台（不用 AskUserQuestion）：

**分配规则**：
- 4 个 🔄 历史位：从 `search_history_summary` 中的已用搜索词填充，按 `time_decay_info` 决定排序模式
- 历史位不足 4 个时，用 🔍 算法推荐的搜索词填满至 10 个
- 算法推荐基于 `sampled_gaps` 中 10 个分组的随机抽样，结合 `tag_distribution_top20` 判断与已有标签的交叉潜力

**搜索词格式**：
- 每个搜索词必须拼接 `"gpt-image-2"` 前缀（如 `"gpt-image-2 oil painting watercolor prompt"`），确保搜索结果与生图相关
- 排序模式：`time_decay_info` 中 48h 内用过 → `live`，超过 48h 或未用过 → `top`

**输出格式**：
```
| # | 搜索词 | 排序 | 类型 | 理由 |
|---|--------|------|------|------|
| 1 | `xxx` | `live` | 🔄 历史 | ... |
| 2 | `xxx` | `top` | 🔍 算法 | ... |
...
| 10 | `xxx` | `top` | 🔍 算法 | ... |
```

## 模块 3：生成指令

1. 确认搜索词和本次收集数量（用 AskUserQuestion）
2. 调用 `--suggest` 模式获取推算结果（含时间衰减排序推荐：48h 内用过 → `live`，否则 → `top`）
3. 格式化输出两条命令到控制台（不自动执行）：

```
📋 执行步骤（按顺序复制执行）：

1️⃣ 初始化基线：
<baseline_cmd>

2️⃣ 启动收集循环：
<ralph_cmd>
```

用户自行复制执行。

## 检查清单

- [ ] 意图识别正确（搜索词构想 / 指令生成 / 完整准备）
- [ ] 计算逻辑由脚本完成，不在上下文中算
- [ ] 输出命令供用户复制，不自动执行
