# 01 OpenAI 官方提示词指南：纯文本层面的身份保留与角色一致性策略

- **来源**: [GPT Image Generation Models Prompting Guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- **来源类型**: 官方文档
- **可信度**: 一手来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **身份保留是 gpt-image-2 的核心能力之一**：官方将 "Robust facial and identity preservation for edits, character consistency, and multi-step workflows" 列为六大关键能力。
- **每轮迭代必须重申不变量（Restate Invariants）**：官方明确指出，在每次迭代中要重复"不变量列表"以防止漂移。编辑时使用 "change only X" + "keep everything else the same" 模式。
- **迭代而非过载（Iterate Instead of Overloading）**：长 prompt 可行，但调试时从干净的基准 prompt 开始，用小改动逐步细化。
- **约束声明（Constraints）的写法**：明确列出排除项和不变量（"no watermark"、"preserve identity/geometry/layout/brand elements"），每次迭代都重复保留列表。
- **虚拟试穿（Virtual Try-On）的文本锁定模式**：明确锁定人物（面部、体型、姿势、发型、表情），仅允许改变服装。
- **多图输入（Multi-Image Inputs）规则**：按索引和描述引用每张输入图，并描述它们之间的关系。
- **input_fidelity 参数**：gpt-image-1.5 支持 `input_fidelity="high"`，gpt-image-2 默认高保真。
- **约束声明的文本写法**："Do not change anything else"——这是官方推荐的编辑模式限定语。

## 原文摘要

OpenAI 官方 Cookbook 提供了 gpt-image-2 的完整提示词框架。在角色一致性方面，核心理念是"分离变化与不变"——每次生成或编辑都显式声明哪些特征必须保留、哪些允许改变。对于纯文本 prompt 场景，关键策略包括：使用精确的角色描述、显式一致性声明、每次迭代重申不变量、从简单基准 prompt 开始迭代。官方还提供了虚拟试穿、风格迁移、场景合成等编辑示例，均体现了一致性约束的核心思路。
