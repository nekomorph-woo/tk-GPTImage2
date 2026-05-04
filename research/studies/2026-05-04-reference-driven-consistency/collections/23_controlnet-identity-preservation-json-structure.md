# 23 ControlNet 身份保留（DWPose + MiDaS 双重控制）

- **来源**: [@tadasgedgaudas](https://x.com/tadasgedgaudas/status/2046877190969610353)
- **来源类型**: 社区画廊
- **可信度**: 社区来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```json
{
  "subject": {
    "description": "Young woman with a fit yet voluptuous physique, appearing in her 20s. She has a fair complexion with visible freckles across her nose and cheeks. Her face is framed by messy, light brown hair styled in an updo with long, wispy bangs covering her forehead.",
    "body_details": {
      "bust": "Extremely voluminous and heavy bust, clearly significantly above average size. The breasts appear full with a natural, heavy teardrop shape, creating deep cleavage.",
      "torso": "Visible collarbones and neck, leading down to the large bust.",
      "skin": "Tanned skin tone with natural sun damage, freckles, and skin texture. Not airbrushed."
    },
    "clothing": {
      "top": "White, scoop-neck sports bra or crop top made of a smooth, matte fabric.",
      "accessories": "A simple gold necklace with a circular pendant. Subtle gold bracelet. Small stud earrings."
    }
  },
  "pose": {
    "type": "Seated selfie portrait",
    "head": "Facing directly forward, chin slightly tucked, gaze directed straight into the camera lens with a pouty expression.",
    "arms_and_hands": "Her right arm extends forward out of frame. Her left hand is raised to her shoulder, with fingers hooking under the bra strap and pulling it slightly outward and upward.",
    "posture": "Leaning slightly forward towards the camera"
  },
  "controlnet": {
    "pose_control": {
      "model_type": "DWPose",
      "purpose": "Exact skeletal and pose lock",
      "constraints": ["preserve hand pulling strap gesture", "preserve head tilt", "preserve shoulder alignment"],
      "recommended_weight": 1.0
    },
    "depth_control": {
      "model_type": "MiDaS",
      "purpose": "Depth, volume, and camera-to-body spatial lock",
      "constraints": ["preserve chest projection relative to face", "maintain car interior depth planes"],
      "recommended_weight": 0.8
    }
  },
  "negative_prompt": {
    "forbidden_elements": ["anatomy normalization", "body proportion averaging", "smaller bust than reference", "identity drift", "beautification filters", "plastic skin"]
  }
}
```

## 图片样例

- ![样例 1](https://pbs.twimg.com/media/HGf326bW4AAAiUx?format=jpg&name=small)
- ![样例 2](https://pbs.twimg.com/media/HGf326cXgAA16Ua?format=jpg&name=small)

## 备注

这个 prompt 展示了非 GPT Image 原生工具链（Nano Banana + ControlNet）中的身份保留策略，但其 JSON 结构化的角色描述方式值得借鉴。关键特征：(1) 使用 JSON 层级结构组织角色信息（subject > body_details > clothing > pose > controlnet > negative_prompt）；(2) ControlNet 部分使用 DWPose 姿态锁定 + MiDaS 深度锁定的双重控制；(3) Negative Prompt 列出了 14 个需要避免的"身份漂移"问题（anatomy normalization, body proportion averaging, identity drift 等）。虽然 GPT Image 2 不使用 ControlNet，但这种"精确声明需要保留和避免什么"的思路完全适用。
