# Recipe：DNA Template 纯文本角色一致性

通过结构化的角色 DNA 文档 + 每次生成前重发 + 显式不变量声明，在不使用参考图的情况下实现跨生成角色一致性。

## 适用场景

无法提供参考图（如从零创建角色），或需要在多轮对话/多场景中保持同一角色外观一致时。特别适合原创角色设计、多场景叙事、角色设计表。

## 核心原理

```
Step 1: 定义角色 DNA（一次性）
  固定顺序描述角色全部视觉特征 → 输出角色定义文档

Step 2: 每次生成前重发 DNA
  DNA 文档 + 新场景描述 + 一致性声明 → 输出保持身份的新场景图
```

## 提示词结构

### 角色DNA 文档（一次性定义，后续逐字复用）

```text
[Format]: [画幅比例], [构图方式]
[Style]: [单一风格锚点]

Character DNA — [角色名]:
- Identity: [年龄], [种族/阵营], [性别]
- Hair: [发型], [发色], [发型细节]
- Eyes: [眼睛颜色], [眼睛形状]
- Face: [脸型], [肤色], [特殊面部特征]
- Body: [体型], [身高比例或 head-to-body ratio]
- Outfit: [完整服装描述，包含材质]
- Accessories: [所有配饰，逐个描述]
- Distinctive features: [最独特的 2-3 个视觉标识]

[Consistency]: This is [角色名]'s character reference — do not redesign her/his appearance. Their appearance must remain perfectly consistent in every image.
```

### 场景生成（每次生成前重发 DNA + 新场景）

```text
[复制完整的角色 DNA 文档]

Scene: [新场景描述]
Pose: [新姿态/动作]
Lighting: [新光线/氛围]
Background: [新环境/背景]

Same character, do not change appearance, outfit, or illustration style.
Keep everything else the same.
```

## 关键参数

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| 风格锚点 | 仅 1 个 | 混合多种风格会降低一致性 |
| 角色描述顺序 | 固定 | Identity → Hair → Eyes → Face → Body → Outfit → Accessories → Distinctive |
| 比例锁定 | 具体数值 | "1:3 head-to-body ratio" 比 "cute proportions" 更有效 |
| 一致性声明 | 每次必附 | 不可省略，防止上下文漂移 |

## 角色描述的固定层次

角色 DNA 必须按以下顺序逐层描述，确保信息完整且结构一致：

1. **Identity**：年龄、种族/阵营、性别
2. **Hair**：发型、发色、细节（ahoge/twin-tails/bangs 等）
3. **Eyes**：颜色、形状、特殊特征
4. **Face**：脸型、肤色、雀斑/疤痕等
5. **Body**：体型、比例
6. **Outfit**：从头到脚的完整服装，包含材质
7. **Accessories**：所有配饰，逐个描述
8. **Distinctive features**：最独特的 2-3 个视觉标识

## 一致性声明三种写法

- **锁定声明**："do not redesign her/his appearance"
- **引用声明**："Same character, do not change appearance, outfit, or illustration style"
- **逐项声明**："Same [feature 1] / Same [feature 2] / Same [feature 3]"

建议：锁定声明 + 逐项声明结合使用，效果最稳定。

## 变体

- **变体 A：多角色 DNA**：每个角色独立 DNA + 差异化标记物（≥2-3 个独特特征的组合），全局共享风格声明。适合群像/漫画。
- **变体 B：序列帧 DNA**：每帧重复完整角色描述 + 风格锚点，只变化镜头角度/姿势/环境。适合故事板/动作序列。
- **变体 C：DNA + 参考图组合**：将 DNA 文档与参考图结合使用（text + visual 双锚点），一致性最强。

## 失败规避

- 角色描述文本逐字复用，不可使用近义词替换
- 每次新生成前必须重发完整 DNA，不可省略
- 一个提示词只放一个强风格锚点
- 避免在 prompt 中出现 "reference sheet" / "multiple views"，会触发模型自行展开
- 长对话中角色会漂移，定期 Fresh Chat + 重发 DNA
- 一次只改一个变量（环境 OR 姿态 OR 光线），便于定位偏移来源

## 验证记录

- 2026-05-04：✅ confirmed，测试主体 Enterprise（碧蓝航线），4 张图平均 22.5/25（90%），跨场景角色一致性 85-90%。来源 `research/studies/2026-05-04-anime-consistency-prompt-engineering/evaluations/round-1.json`
