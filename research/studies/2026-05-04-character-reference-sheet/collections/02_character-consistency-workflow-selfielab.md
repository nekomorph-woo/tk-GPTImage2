# 02 SelfieLab 角色一致性 7 步工作流与高级 Prompt 工程

- **来源**: [SelfieLab](https://selfielab.me/blog/chatgpt-image-gen-character-sheet-mastery-tutorial-20260220)
- **来源类型**: 博客指南
- **可信度**: 社区来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **7 步角色表生成工作流**：(1) 定义角色基础属性 → (2) 建立视觉锚点描述 → (3) 选择画幅与布局 → (4) 编写主 prompt → (5) 生成初版 → (6) 基于初版编辑优化 → (7) 导出与归档
- **核心公式**：`[Reference Image] + [Pose/Scene Description] + [Style/Details] + [Consistency Keywords]`
- **一致性关键词清单**："exact same face"、"identical build"、"same skin tone"、"same proportions"、"do not change appearance"、"maintain identity throughout"
- **Reference Image 锚定模式**：先建立角色参考图（纯色背景正面照），后续所有生成都引用该参考图作为"身份锚"，只改变姿势/场景/表情
- **Edit 端点优势**：使用 OpenAI API edit 端点可同时传入最多 16 张参考图，适合多角度一致性
- **"Same Character" 模式**：在 prompt 中明确写 "same character, do not change"，配合参考图可实现跨场景一致性
- **3x3 Grid 布局**：9 格网格是表情/姿势表的经典布局，每个格子明确指定姿势和表情名称

## 原文摘要

SelfieLab 提供了完整的 ChatGPT 图片生成角色表教程。强调"参考图锚定"是角色一致性的核心方法：先生成一张干净的角色参考图，后续所有生成（不同姿势、表情、场景）都引用该图作为身份锚点。

高级技巧包括：(1) 使用 edit 端点而非 generate 端点，支持多参考图输入；(2) 一致性关键词放在 prompt 尾部作为"不变量指令"；(3) 角色描述词逐字复用，避免用近义词替换；(4) 从简单布局开始，确认角色一致后再增加复杂度。

专业示例展示了使用参考图生成"9 姿势 3x3 网格奇幻战士角色表"的完整 prompt，强调"Using this reference image exactly for the character's face, build, and skin tone"这一核心句式。
