# 09 Z52 水滑梯动作镜头——碧蓝航线角色纯文本生成（无参考图）

- **来源**: 项目内部生成记录（codex-cli）
- **来源类型**: 一手样本
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Anime illustration, Azur Lane Z52 in a sporty navy swimsuit with white accents, speeding down a steep water slide at a summer water park. DYNAMIC SIDE ACTION SHOT, low angle tracking her descent. Z52 has silver twin-tail hair and red eyes, grinning with excitement, one arm stretched forward. Massive water spray and splash effects trailing behind her. The slide structure is visible as a towering spiral of blue and white tubes. Motion blur on background, sharp focus on Z52. Clean anime linework, vibrant summer palette. No text, no watermark.
```

## 图片样例

- 生成 1 张，尺寸 1536x1024
- 生成时间：约 1 分 10 秒

## 备注

Z52 是碧蓝航线铁血阵营（Iron Blood）的驱逐舰角色。这个 prompt 是纯文本生成（无参考图），展示了碧蓝航线角色在动作场景中的文本描述策略：

1. **角色识别锚点**："Azur Lane Z52" + "silver twin-tail hair and red eyes"——仅用发色/发型和瞳色作为识别锚点，未包含舰装
2. **泳装替代军装**：将角色放入休闲泳装场景，完全省略舰装描述——这降低了复杂度但牺牲了角色完整性
3. **缺少阵营标识**：未提及铁血阵营的视觉特征（如 Iron Blood 的铁十字元素、黑红配色）
4. **动作优先**：prompt 的核心是"speeding down a steep water slide"，角色描述被压缩到一行

对比 Enterprise 的参考图 prompt，Z52 的纯文本 prompt 明显缺少：完整外貌描述、服装细节、配饰列表、舰装描述。这说明纯文本模式下碧蓝航线角色的信息密度不足，可能导致角色识别度下降。
