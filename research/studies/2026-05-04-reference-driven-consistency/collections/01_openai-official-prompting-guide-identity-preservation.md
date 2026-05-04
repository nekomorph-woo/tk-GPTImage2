# 01 OpenAI 官方提示词指南：身份保留与角色一致性工作流

- **来源**: [GPT Image Generation Models Prompting Guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- **来源类型**: 官方文档
- **可信度**: 一手来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **身份保留是 gpt-image-2 的核心能力之一**：官方文档将 "Robust facial and identity preservation for edits, character consistency, and multi-step workflows" 列为 gpt-image-2 的六大关键能力之一。
- **参考图（Reference Image）是实现角色一致性的基础机制**：通过 `image` 参数传入参考图，模型会以图片为视觉锚点，在编辑和生成中保留面部特征、身体比例和身份信息。
- **角色锚点（Character Anchor）模式**：官方推荐的两步工作流——先创建角色参考图（锁定外貌、比例、服装和基调），再通过编辑模式在新场景中重用角色。
- **每轮迭代必须重申不变量（Restate Invariants）**：官方明确指出，在每次迭代中要重复"不变量列表"以防止漂移。编辑时使用 "change only X" + "keep everything else the same" 模式。
- **虚拟试穿（Virtual Try-On）的身份锁定模式**：明确锁定人物（面部、体型、姿势、发型、表情），仅允许改变服装，要求逼真的穿着效果和一致的光照/阴影。
- **多图输入（Multi-Image Inputs）规则**：按索引和描述引用每张输入图（"Image 1: product photo... Image 2: style reference..."），并描述它们之间的关系。
- **input_fidelity 参数**：gpt-image-1.5 支持 `input_fidelity="high"` 来增强对输入图的保真度，gpt-image-2 默认高保真。
- **约束声明（Constraints）的写法**：明确列出排除项和不变量（"no watermark"、"preserve identity/geometry/layout/brand elements"），每次迭代都重复保留列表。
- **迭代而非过载（Iterate Instead of Overloading）**：长 prompt 可行，但调试时从干净的基准 prompt 开始，用小改动逐步细化。
- **质量与保真度的权衡**：身份敏感编辑建议使用 `quality="medium"` 或 `quality="high"`。

## 原文摘要

OpenAI 官方 Cookbook 提供了 gpt-image-2 的完整提示词框架，涵盖生成和编辑两大工作流。在角色一致性方面，官方明确将身份保留列为核心能力，并提供了标准的 "Character Anchor" 工作流模式：先用 generate 创建角色参考图，再用 edit 在新场景中保持角色一致。关键技巧包括：显式声明不变量、使用 "Do not change anything else" 限定编辑范围、按索引引用多图输入、以及在身份敏感场景中使用高质量设置。官方还提供了虚拟试穿、风格迁移、场景合成等编辑示例，均体现了"分离变化与不变"的核心理念。
