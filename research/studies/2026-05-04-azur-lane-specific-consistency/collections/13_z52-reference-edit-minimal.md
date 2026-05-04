# 13 Z52 参考图编辑——极简 prompt 的角色保持

- **来源**: 项目内部生成记录（codex-cli）
- **来源类型**: 一手样本
- **可信度**: 一手来源
- **素材类型**: prompt
- **采集时间**: 2026-05-04

## Prompt

```
Anime illustration, Azur Lane Z52 in a sporty navy swimsuit, splashing into a pool. Clean anime linework, vibrant summer palette. No text, no watermark.
```

## 图片样例

- 生成 1 张，尺寸 1023x1537（竖版）
- 参考图：z52.jpg（Z52 游戏立绘）
- 生成时间：约 1 分 3 秒

## 备注

这是一个极简 prompt + 参考图的测试。prompt 仅一行，几乎不包含角色描述细节——所有角色信息完全依赖参考图。对碧蓝航线角色一致性的关键启示：

1. **参考图模式下 prompt 可以极简**：当上传了游戏立绘作为参考图时，prompt 中的角色描述可以大幅缩减
2. **参考图质量决定输出质量**：使用官方立绘作为参考时，角色面部、发色、体型的还原度明显高于纯文本生成
3. **"in a sporty navy swimsuit"覆盖了立绘中的军装**——参考图的角色身份被保留，但服装被 prompt 中的新服装描述覆盖。这说明参考图模式下，新 prompt 中的服装描述优先级可能高于参考图中的服装。
4. **速度优势**：极简 prompt 的生成时间（1 分 3 秒）远低于详细 prompt（4-5 分钟），且使用参考图时通常走代理通道更稳定

碧蓝航线角色的参考图策略结论：如果能获取高质量游戏立绘作为参考，应该优先使用参考图模式而非纯文本描述。
