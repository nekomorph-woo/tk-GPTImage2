# 05 ImagineArt 指南：文本角色锚点（Character Anchor）工作流

- **来源**: [GPT Image 2 Prompt Guide + 70 Prompts](https://www.imagine.art/blogs/gpt-image-2-prompt-guide)
- **来源类型**: 博客指南
- **可信度**: 二手来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **角色锚点（Character Anchor）模式**：先用一段纯文本 prompt 建立角色的完整描述（锚点），后续场景 prompt 只改变环境，角色描述保持逐字一致。
- **锚点 Prompt 示例结构**：
  - 角色命名（"A young woman named Mara"）
  - 外貌逐项描述：头发颜色和长度、肤色、雀斑、眼睛颜色
  - 服装描述：具体到每件衣物
  - 风格声明：艺术风格和调色板
  - 一致性声明："This is her character reference — do not redesign her appearance."
- **场景 Prompt 的一致性约束**：每个场景 prompt 都包含 "Same character, do not change her appearance, outfit, or illustration style."
- **迭代时重申不变量**："same composition, same subject, same background — only change the jacket color"
- **六核心构建块框架**：Scene/Background → Subject → Key Details → Composition → Lighting & Mood → Constraints
- **常见错误**：
  - 在编辑时对"不变量"含糊不清——必须明确声明不能改变什么
  - 跨迭代时不变量漂移——每次迭代都要重新声明
  - 过度加载单个 prompt——从干净的基准开始逐步细化

## 原文摘要

ImagineArt 的 GPT Image 2 prompt 指南提出了"Character Anchor"文本工作流：先用一段完整的角色描述建立锚点（包含姓名、外貌、服装、风格、一致性声明），然后在后续每个场景 prompt 中保持角色描述逐字一致，只改变环境。该指南还提出了六核心构建块框架（场景→主体→细节→构图→光线→约束），并提供了完整的角色锚点示例和 5 个场景 prompt 示例，展示了文本层面的一致性策略。
