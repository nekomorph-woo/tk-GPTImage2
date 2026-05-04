# 03 双图引用提取角色转角度 — Reference-Interference 技术

- **来源**: [BigPromptHub](https://www.bigprompthub.com/extract-character-turnarounds-sheet-prompt/)
- **来源类型**: 博客指南
- **可信度**: 社区来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **Reference-Interference 逻辑**：将两张图同时传入 edit 端点，img1 作为语义锚（角色身份），img2 作为结构约束（转角度格式）
- **提取 Prompt 核心句式**："extract the [character] from [img1] using the character turnaround format from [img2]"
- **双图协作原理**：模型从第一张图读取角色外观，从第二张图理解"转角度表"的布局结构，二者结合生成该角色的转角度表
- **适用场景**：已有角色单图，需要生成完整转角度表；无需手动描述角色外观，直接从图片提取
- **局限性**：依赖 edit 端点的多图理解能力，角色细节可能不完美保留，建议生成后用额外 prompt 细化

## 原文摘要

BigPromptHub 介绍了一种利用 GPT Image 2 edit 端点的双图引用技术来提取角色转角度表。核心思路是：将一张角色图和一张转角度表模板图同时传入，prompt 指示模型"从图1提取角色，使用图2的格式"，从而生成该角色的转角度表。

这种方法避免了手动描述角色外观的繁琐步骤，特别适合从已有角色设计（单图）快速生成完整多角度参考表。文章将该技术命名为 "Reference-Interference"，强调两张参考图各自承担不同角色（语义 vs 结构）。
