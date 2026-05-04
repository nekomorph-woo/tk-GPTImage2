# 48 角色转角度提取 Prompt — BigPromptHub 双图引用

- **来源**: [BigPromptHub](https://www.bigprompthub.com/extract-character-turnarounds-sheet-prompt/)
- **来源类型**: 博客示例
- **可信度**: 社区来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Using the character from the first image as the exact reference, extract this character and create a clean character turnaround sheet matching the format and layout style of the second image. Show front view, side view, and back view. Maintain the character's exact face, hairstyle, body proportions, clothing, and all visual details. Do not alter or simplify any design elements. Use a clean neutral background, consistent lighting, and professional model sheet quality.
```

## 备注

BigPromptHub 的 Reference-Interference 核心提取 prompt。使用 edit 端点双图引用：img1 = 角色来源图，img2 = 转角度格式参考图。"exact reference"、"do not alter or simplify any design elements" 确保忠实提取。这是从已有单图角色生成完整转角度表的方法。
