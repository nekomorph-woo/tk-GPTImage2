# 02 OpenAI 社区：DNA Template 纯文本角色一致性技巧

- **来源**: [Need for Character Consistency and Style Locking](https://community.openai.com/t/need-for-character-consistency-and-style-locking-in-image-generation/1232362)
- **来源类型**: 社区讨论
- **可信度**: 社区来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **DNA Template 是纯文本角色一致性的核心技巧**：在每次生成新场景前，先发送一段完整的角色描述模板（DNA），锁定角色的所有视觉特征、风格和基调，然后再给出具体场景指令。不依赖参考图。
- **模板必须包含的核心要素**：
  - 画面格式和比例（如 "wide size 3:2 aspect ratio"）
  - 艺术风格（如 "watercolor anime style"）
  - 项目标题和主题概述
  - 完整的角色外观描述（肤色、脸型、眼睛、发型、体型、服装差异标记）
  - 情绪和表情基调
  - 风格渲染指令（光线、色调、笔触）
  - 构图规范（如 "cinematic horizontal composition with medium-wide shot"）
  - 显式一致性声明："Their appearance must remain perfectly consistent in every image."
- **区分角色的标记物**：对于多个相似角色（如三胞胎），为每个角色分配独特的配饰（丝带、吊坠、日记本等），以区分身份。
- **DNA Template 的使用时机**：在每个新场景的 prompt 之前发送，让模型在新上下文中重置对角色的理解，避免长对话中的漂移。
- **社区验证的痛点**：用户报告的主要问题包括肤色/体型变化、艺术风格和色调漂移、AI 解释覆盖用户意图。DNA Template 通过显式重申所有不变量来对抗这些问题。
- **多轮生成（Multi-Turn）策略**：配合 DNA Template，在一个对话中逐个生成场景，每个场景前都重发 DNA。

## 原文摘要

OpenAI 社区用户 june0407 提出了对角色一致性和风格锁定的迫切需求，社区成员 polepole 提供了 DNA Template 解决方案。该模板本质上是一个完整的纯文本角色设定文档，包含格式、风格、场景环境、角色外貌（从头到脚的详细描述）、情绪基调、渲染参数和构图规范。核心思路是：在 ChatGPT 的多轮对话中，每次生成新场景前都先发送 DNA Template，让模型"重新校准"对角色的理解。该方案特别适用于多角色叙事（如三胞胎姐妹）和长篇视觉故事，完全不依赖参考图。
