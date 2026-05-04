# 20 Geniea 动漫角色设计最佳实践——IP 角色提示词分层策略

- **来源**: [Geniea](https://www.geniea.com/prompts/gpt-image-anime-character-design)
- **来源类型**: 提示词指南
- **可信度**: 二手来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **动漫角色设计 Prompt 的五层结构**：
  1. 基础声明（"Create an anime image of [subject] featuring character design"）
  2. 构图情绪（"The composition should feel serene/dynamic/dramatic"）
  3. 光线描述（"with sunset rim light / neon ambient glow / moonlit scene"）
  4. 色彩系统（"Use high-contrast monochrome / analogous warm palette / neon accent colors"）
  5. 质量声明（"professional anime piece"）
- **保持 IP 角色一致性的技巧**：
  - 从简洁 prompt 开始，逐步添加动漫特定细节——对碧蓝航线角色，先锁定核心外貌，再逐步添加舰装、配饰、阵营标识
  - 引用具体光线条件给 GPT Image 更清晰的方向
  - 组合多种风格描述符获得最动态的结果，但不要混合矛盾的风格
  - 运行多次迭代并组合不同输出中的元素
- **常见错误（碧蓝航线相关）**：
  - 跳过风格特定术语——GPT Image 需要"anime"风格词才能产出碧蓝航线风格的日系动漫结果
  - 塞入太多概念——碧蓝航线 prompt 容易因为同时描述角色、舰装、场景、动作而过度复杂化
  - 不调整 Size——默认 1024x1024 很少给出最佳舰装展示效果，竖版更适合展示全身+舰装

## 原文摘要

Geniea 的动漫角色设计指南提供了五层 prompt 结构，从基础声明到质量声明。对碧蓝航线等 IP 角色的核心建议是：保持 prompt 聚焦于统一的美学，使用"anime"等动漫特定术语，从简洁开始逐步迭代。碧蓝航线角色 prompt 的复杂度（角色描述 + 舰装描述 + 阵营标识 + 配饰列表）使其特别容易触犯"塞入太多概念"的错误，需要分层次组织信息。
