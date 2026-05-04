# 38 JSON 结构化人像参数（豪车后座场景）

- **来源**: [@Just_sharon7](https://x.com/Just_sharon7/status/2050568560057962664)
- **来源类型**: 社区画廊
- **可信度**: 社区来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```json
{
  "prompt": {
    "subject": "young woman seated in luxury SUV backseat, one arm raised behind head, holding smartphone, relaxed confident pose",
    "styling": {
      "top": "red varsity knit sweater with white stripe detailing and script lettering",
      "bottom": "black pants with Burberry plaid skirt or scarf draped over lap",
      "headwear": "navy blue Lacoste dad cap, slightly forward",
      "accessories": ["lanyard badge around neck", "AirPods Max headphones on floor", "red tote bag with embroidered detail"]
    },
    "setting": {
      "location": "luxury SUV backseat interior",
      "interior": "black leather seats with cream contrast stitching, panoramic sunroof, wood trim accents",
      "background": "urban street visible through rain-speckled car window, brick buildings"
    },
    "mood": "effortlessly cool, candid, off-duty model energy",
    "lighting": "natural daylight through car windows, soft overcast light",
    "camera": {
      "angle": "slight low angle, 3/4 view",
      "style": "candid iPhone snapshot, realistic, not staged"
    },
    "color_palette": ["crimson red", "navy blue", "cream white", "camel plaid", "black"]
  }
}
```

## 图片样例

- ![样例 1](https://pbs.twimg.com/media/HHUVOVjW4AAE4nA?format=jpg&name=small)

## 备注

这个 prompt 使用 JSON 格式精确控制角色的每个维度：(1) subject 定义姿态和表情；(2) styling 分层定义服装（top/bottom/headwear/accessories）；(3) setting 定义环境和背景；(4) color_palette 列出 5 个主色。JSON 格式的优势在于每个参数都是独立可调的——改变一个值不会影响其他参数，这与"一次只改一个变量"的迭代原则完美契合。如果将 JSON 角色描述作为 DNA Template 的基础格式，可以实现更精确的角色一致性控制。
