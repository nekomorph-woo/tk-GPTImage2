# 47 Fal.ai 五段式 Prompt 模板（动漫角色一致性约束）

- **来源**: [NemoVideo Fal.ai Template Reference](https://www.nemovideo.com/blog/gpt-image-2-prompts-templates-guide)
- **来源类型**: 博客指南
- **可信度**: 二手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Scene: [场景描述]

Subject: [角色完整描述，包含头发、眼睛、服装、体型]

Details: [角色细节 — 配饰、纹理、表情]

Use-case: [用途 — 如 multi-panel comic, character sheet, poster]

Constraints: maintain exact same face and body proportions across all panels. Same art style. No text overlay. No watermark.
```

## 备注

Fal.ai 的五段式模板将一致性约束放在 Constraints 段落中。关键技巧：(1) Constraints 段落是专门用于声明不变量的位置——"maintain exact same face and body proportions across all panels" 覆盖了核心一致性维度；(2) "Same art style" 确保风格不漂移；(3) 否定约束（"No text overlay"）防止意外元素。这种"将一致性声明放在独立段落"的做法使 prompt 结构更清晰，也更不容易遗漏。
