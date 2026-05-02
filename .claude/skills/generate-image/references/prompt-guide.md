# 提示词构造指南

## 优先级

当用户没有提供完整提示词时，按以下顺序参考：

1. `prompts/prompt-cards/` — 可复用提示词卡片
2. `recipes/recipes.json` — 稳定风格套路
3. `prompts/PROMPT_FRAMEWORK.md` — 标准提示词结构
4. `prompts/NEGATIVE_CONSTRAINTS.md` — 失败规避短语
5. `GPT_IMAGE2_GRIMOIRE.zh-CN.md` — 完整魔导书
6. `references/prompt-recipes.md` — 提示词配方参考与诊断

## 核心公式

```text
创建一张[格式]，主体是[主体]。
构图：[镜头/裁切/布局]。
视觉语言：[风格锚点]。
光线：[光线]。
材质与细节：[材质]。
色彩：[调色板]。
文字：[精确文字与位置，或"无文字"]。
质量约束：[具体失败规避]。
```

## 规则

- 不要堆叠"masterpiece, ultra detailed"等模糊质量词
- 中文海报：精确中文标题放引号内，声明"不要额外随机文字"
- 质量约束写具体失败场景（"手部连贯""不要拼写错误"），不写空泛赞美词
