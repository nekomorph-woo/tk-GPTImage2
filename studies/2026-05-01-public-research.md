# 2026-05-01 公开资料研究笔记

## OpenAI 官方文档

发现：

- `gpt-image-2` 被官方文档列为当前 GPT Image 系列的生成与编辑模型。
- Image API 适合直接的单次文本生图或单次编辑。
- Responses API 更适合对话式、多轮图片工作流。
- 输出控制包括尺寸、质量、格式、压缩和背景。
- `gpt-image-2` 当前不支持透明背景。
- `low` 质量适合草稿和快速迭代；`medium`/`high` 应留给认真候选图或最终资产。
- 文字指令应精确、简短、放在引号中，并明确位置。
- 多图参考工作流应说明每张图的角色，并使用清晰的空间描述。

来源：

- https://developers.openai.com/api/docs/models/gpt-image-2
- https://developers.openai.com/api/docs/guides/image-generation
- https://openai.com/academy/image-generation/

## 社区/X 衍生提示词库

观察到的类别地图：

- 摄影与写实
- 游戏与娱乐
- UI/UX 与社媒视觉
- 视频、动画与拼贴
- 字体与海报设计
- 信息图、教育图与文档
- 角色与一致性
- 图像编辑与风格迁移

工作推断：

社区成功案例通常不是依赖某个隐藏超级 prompt，而是准确命名视觉类型、加入具体场景细节，并且每轮实验只选择一个主控制轴。

来源：

- https://github.com/ZeroLu/awesome-gpt-image/

## 可复用经验

- 写实提示词常通过普通环境细节和相机缺陷增强真实感。
- 海报提示词需要明确的排版规则和克制文字。
- 产品提示词在指定反射、表面、轮廓和留白后会明显改善。
- 角色提示词应先从中性参考设定图开始，再进入复杂场景。
- 编辑提示词应把“受保护元素”和“要改变的元素”分开写。
