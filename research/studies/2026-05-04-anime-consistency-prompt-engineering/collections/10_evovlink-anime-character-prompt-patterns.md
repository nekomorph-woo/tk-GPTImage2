# 10 EvoLinkAI 仓库：动漫角色设计 Prompt 模式分析

- **来源**: [awesome-gpt-image-2-prompts (GitHub)](https://github.com/EvoLinkAI/awesome-gpt-image-2-prompts)
- **来源类型**: 社区画廊
- **可信度**: 社区来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **角色设计 Prompt 的文本模式**：从 EvoLinkAI 仓库中的 Character Design Cases 提炼出的常见文本结构：
  - 基于上传图片的提示词（Persona5 角色资料卡：三视图、表情变化、服装分解、色板、世界观设定）
  - 纯文本角色描述（Mecha Girl 海城 KV：完整的从头到脚角色规格 + 环境描述 + 镜头/构图/光线规格）
- **Mecha Girl 角色描述的文本 DNA 结构**：
  1. 身份/年龄（"mid-teens"）
  2. 肤色/质感（"pale skin smudged with soot and salt spray"）
  3. 眼睛（"sharp amber eyes with glowing HUD reticles"）
  4. 发型（"waist-length ash-white hair tied in a high ponytail whipping in the sea wind"）
  5. 服装/装甲（"matte gunmetal exoskeleton armor plating shoulders, forearms and shins"）
  6. 配饰（"dog tags and frayed red ribbon at her collar"）
  7. 姿势（"standing off-center to the left, weight shifted onto one leg"）
  8. 表情（"quiet defiant stare"）
  9. 环境细节（"vast derelict sea-city at dusk"）
  10. 技术/渲染参数（35mm anamorphic, shallow DOF, cinematic anime key visual）
- **多面板一致性模板**（Case 105）："Maintain strong subject consistency across all panels, with consistent color and lighting"
- **关键观察**：高保真角色 prompt 的共同特征是极细粒度的外貌描述 + 明确的渲染/镜头参数 + 具体的光线/色调系统

## 原文摘要

EvoLinkAI 的 GPT-Image-2 prompt 仓库包含了大量角色设计案例。分析其文本模式发现：成功的动漫角色 prompt 都遵循"完整角色 DNA + 环境 + 技术参数"的三层结构。Mecha Girl 案例尤其展示了纯文本角色描述的力量——从头到脚完整描述了每个视觉元素（皮肤质感、眼睛细节、发型动态、装甲细节、配饰、姿势、表情），并配合具体的环境和渲染参数，构成了一份可跨生成复用的文本 DNA。
