# 36 对话式服装风格一致性（同一角色换装）

- **来源**: [@Just_sharon7](https://x.com/Just_sharon7)
- **来源类型**: 社区画廊
- **可信度**: 社区来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

（基于 @Just_sharon7 的对话式换装风格。该用户以在 ChatGPT 对话中通过自然语言请求角色换装而闻名，核心策略是在对话中保持角色的面部和身体特征不变，只变化服装。）

```
Keep the same person's face, body proportions, and overall vibe, but change their outfit to [new outfit description]. Maintain the same background and lighting style.
```

## 备注

对话式角色一致性的典型案例。核心模式："Keep the same person's face, body proportions, and overall vibe, but change their outfit"——一句话锁定所有不变量（面部/体型/氛围），然后只改变服装。这种"不变量 + 唯一变量"的模式是纯文本角色一致性的最简洁实现。适用于在一个对话中生成同一角色多种造型。
