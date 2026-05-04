# 03 OpenAI 社区：稳定单角色动漫插画纯文本 Prompt 模板

- **来源**: [Stable Single-Character Anime Prompt Template](https://community.openai.com/t/stable-single-character-anime-prompt-template-avoids-multi-panel-issues/1379868)
- **来源类型**: 社区讨论
- **可信度**: 社区来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **防止意外的多面板/参考表输出**：明确在 prompt 中声明 "single character, no reference sheet, no multiple panels" 以防止模型自行展开为角色设计表。
- **结构化的角色描述模板**，按以下固定顺序描述角色：
  1. 角色类型声明（"An anime-style illustration of [character type]"）
  2. 头发描述 + 发型
  3. 眼睛描述
  4. 性格 + 通过面部表情和肢体语言表达
  5. 体型
  6. 服装
  7. 姿势（"natural and expressive"）
  8. 构图约束（single character, no reference sheet, no multiple panels）
  9. 光线 + 色板 + 整体氛围
  10. 画面质量指令（clean composition, strong silhouette, natural visual flow）
- **模板的扩展性**：可以添加兽耳、翅膀等幻想特征而不破坏稳定性。
- **反面约束**：避免添加 "reference sheet" 或 "multiple views" 词汇，除非明确需要模型表。
- **关键发现**：该结构化模板比随机拼凑的 prompt 稳定得多，能有效避免解剖比例不一致、表情丢失等问题。

## 原文摘要

OpenAI 社区用户 ss_template 分享了一个专门针对 GPT Image 2 的单角色动漫插画 prompt 模板。该模板通过固定的结构化顺序（类型声明→头发→眼睛→性格→体型→服装→姿势→构图约束→光线→质量指令）来确保输出的稳定性。核心创新在于显式的构图约束声明——告诉模型不要输出参考表或多面板。用户反馈该模板比临时编写的 prompt 更加稳定，可以安全地扩展（添加兽耳等特征）而不破坏一致性。
