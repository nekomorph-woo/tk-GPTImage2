# 24 SelfieLab 角色一致性工作流——参考图到场景的完整流程

- **来源**: [SelfieLab](https://selfielab.me/blog/chatgpt-image-gen-character-sheet-mastery-tutorial-20260220)
- **来源类型**: 博客指南
- **可信度**: 二手来源
- **素材类型**: guide
- **采集时间**: 2026-05-04

## 指导要点

- **角色一致性工作流的三阶段模型**：
  1. **创建参考图**：在纯净背景上生成全身角色参考图，确保面部和身体清晰
  2. **生成设定页**：基于参考图创建多角度、多表情的角色设定页
  3. **场景编辑**：使用设定页作为参考，将角色放入不同场景
- **参考图 prompt 的关键要求**：
  - 纯净背景（纯色或浅灰色），去除所有场景干扰
  - 角色居中构图，全身可见
  - "clean character concept art style"
- **设定页 prompt 的关键要求**：
  - "consistent proportions across all views"
  - 多角度展示（front, side, back）
  - 表情和姿势变化
  - 配饰和服装细节特写
- **场景编辑 prompt 的关键要求**：
  - "Using this reference image exactly for..."
  - "Maintain the exact same face, body proportions, and skin tone"
  - "Do not change any character features"
- **碧蓝航线角色适配**：
  - 阶段 1 需要在参考图中包含舰装——纯净背景下舰装的完整性更容易保持
  - 阶段 2 的设定页应该包含舰装结构分解
  - 阶段 3 的编辑指令需要额外声明"preserve rigging structure and faction accessories"

## 原文摘要

SelfieLab 的教程系统化了"参考图 → 设定页 → 场景编辑"的三阶段角色一致性工作流。对碧蓝航线角色，每个阶段都需要额外处理舰装的描述和保持。关键建议是：舰装应从参考图阶段就完整包含，不要在后续阶段才添加——提前包含舰装可以确保它在设定页和场景编辑中被正确理解和保持。
