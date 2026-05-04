# 43 角色设计表生成指南（Dreamina 最佳实践）

- **来源**: [Dreamina Character Consistency Workflow](https://selfielab.me/blog/chatgpt-image-gen-character-sheet-mastery-tutorial-20260220)
- **来源类型**: 博客指南
- **可信度**: 二手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Generate a realistic portrait of a 30-year-old female elf ranger with green eyes, freckles, and short auburn hair.
```

**迭代修正：**

```
Redo pose 3 with the exact same green eyes and freckles from the reference. Keep all other elements identical.
```

**扩展服装变体：**

```
Expand this sheet with clothing variations: casual outfit, armor, winter gear. Include height chart and color palette.
```

## 备注

展示了纯文本角色定义 + 迭代修正的一致性工作流。核心模式：(1) 初始 prompt 定义角色（"30-year-old female elf ranger with green eyes, freckles, and short auburn hair"）；(2) 迭代修正时引用具体特征（"exact same green eyes and freckles"）；(3) 扩展时保持风格一致（"casual outfit, armor, winter gear" + "height chart and color palette"）。关键发现：短 prompt 也能通过迭代修正达到一致性，但需要多次迭代。
