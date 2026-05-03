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

- [scripts/coverage-analysis.py](scripts/coverage-analysis.py) — 覆盖度分析 + 搜索词去重 + 指令推算
  - 无参数 → 覆盖度报告
  - `--suggest "搜索词" 数量` → JSON 推算结果（去重判断、排序推荐、max-iterations、完整命令）
- [reference/search-categories.md](reference/search-categories.md) — GPT Image 2 常见应用类别

## 模块 1：状态分析（自动）

```
python3 .claude/skills/prepare-collection/scripts/coverage-analysis.py
```

输出覆盖度报告：已收集/已跳过/跳过率、搜索词历史、标签 TOP 15、作者 TOP 10、低覆盖领域。

## 模块 2：搜索词构想

1. 执行模块 1，展示覆盖报告
2. 基于低覆盖领域推荐 3-5 个搜索词
3. 用 AskUserQuestion 让用户选择或自定

脚本自动判断搜索词是否已用过（关键词交集 Jaccard >= 0.7 判为重复），通过 `--suggest` 模式返回 `recommended_sort`（`live` 或 `top`）。

## 模块 3：生成指令

1. 确认搜索词和本次收集数量（用 AskUserQuestion）
2. 调用 `--suggest` 模式获取推算结果
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
