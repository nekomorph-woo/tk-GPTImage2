# 09 SelfieLab 指南：角色表生成与文本迭代优化工作流

- **来源**: [ChatGPT Image Gen Character Sheet Mastery Tutorial](https://selfielab.me/blog/chatgpt-image-gen-character-sheet-mastery-tutorial-20260220)
- **来源类型**: 博客指南
- **可信度**: 二手来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **角色表的文本 Prompt 工程框架**：[Reference] + [Pose/Scene] + [Style/Details] + [Consistency Keywords]，目标是 95% 保真度。
- **一致性关键词（Consistency Keywords）**：每次都包含 "exact same face, body proportions, age, ethnicity from reference image. No changes to identity."
- **Pose 库策略**：引用标准姿势表——"T-pose, A-pose, combat stance like in character turnaround sheets from Blizzard games"
- **多角度掌控**：文本指定具体角度列表——"Generate 8 views: front, back, left side, right side, 3/4 front, 3/4 back, top-down, close-up headshot"
- **风格锁定**：文本中声明 "Maintain hyper-realistic style matching reference, by [artist] if needed"
- **文本优化策略**：不要一次性解决所有问题——先建立干净的基准 prompt，然后用单次变化的跟进 prompt 逐步细化。
- **角色描述的 7 步模板**：
  1. 准备参考描述（纯文本角色定义）
  2. 上传并锚定（文本 prompt 中的角色锁定声明）
  3. 指定表格布局（grid layout, labeled poses, consistent lighting）
  4. 生成并审查
  5. 针对性迭代修正（"Redo pose 3 with the exact same eyes and freckles"）
  6. 添加服装变体和色板
  7. 导出组装

## 原文摘要

SelfieLab 的角色表教程提供了 7 步文本 Prompt 工作流，核心框架是 [Reference] + [Pose/Scene] + [Style/Details] + [Consistency Keywords]。关键发现是：包含显式一致性关键词（"exact same face, body proportions"）可以将保真度提升到 95%。教程还强调文本描述需要覆盖角色表的所有视图（front, back, side, 3/4），并通过逐次迭代修正来达到一致性。
