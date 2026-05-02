# 提示词分析指南

## 分析方式

按素材类型分流分析：

### guide 类型 → 原则提炼

从指导文档中提取：
- **核心原则**：作者强调的关键规则（如"一个风格锚点""构图写在细节前"）
- **技巧模式**：具体的操作建议（如"光线要像真实拍摄一样写"）
- **反面案例**：应避免的做法（如"不要堆叠多个风格词"）
- **可操作项**：能直接转化为 recipe 结构的具体建议

写入 `report.md` 的「来源」章节，作为背景知识。

### prompt 类型 → 8 维结构拆解

按以下维度逐条拆解：

| 维度 | 关注点 |
|------|--------|
| 主体清晰度 | 是否具体、可识别 |
| 构图策略 | 镜头角度、裁切、主体位置、留白 |
| 风格锚点 | 是否单一、具体（避免堆叠多个风格） |
| 光线描述 | 方向、软硬、色温、阴影 |
| 材质细节密度 | 表面纹理、物件质感 |
| 色彩策略 | 主色、强调色、调性 |
| 文字规则 | 精确文字、位置、字体规则 |
| 失败规避 | 针对常见问题的约束 |

写入 `report.md` 的「提示词结构拆解」章节。交叉引用素材编号，如 `[02]`、`[05-08]`。

## 自动评分

### 读图方式

- 本地图片：使用 Read 工具读取 PNG/JPG 文件（Claude 多模态能力）
- 远程 URL：使用 MCP 读图工具（如 4_5v_mcp）分析图片内容

### 评分标准

按 `prompts/REVIEW_RUBRIC.md` 的 7 个维度，每维 1-5 分。

### 多轮评分

每轮修订对应一个独立的评分文件，保存在 `evaluations/` 目录下：

```
evaluations/
├── round-1.json
├── round-2.json
└── ...
```

每个文件记录该轮所有测试图的评分：

```json
{
  "round": 1,
  "prompt": "该轮使用的测试提示词",
  "revision_note": "首轮，无修订 / 修订了光线：从冷色改为暖色",
  "images": [
    {
      "file": "gen/outputs/<timestamp>-<name>/01.png",
      "scores": {
        "subject_clarity": 4,
        "composition": 3,
        "prompt_compliance": 5,
        "material_quality": 3,
        "text_quality": 4,
        "stability": null,
        "commercial_usability": 3
      },
      "total": 22,
      "notes": "主体清晰但材质偏平，光线对比不足"
    }
  ],
  "round_total": 22,
  "round_max": 30,
  "pass": false,
  "evaluated_at": "ISO timestamp"
}
```

**首轮** `stability` 为 null（6 个有效维度，满分 30）。**后续轮次** stability 可打分（7 个维度，满分 35）。

### 通过标准

- 每个已评维度 ≥ 3 分
- 总分 / 满分 ≥ 70%（首轮 ≥ 21/30，后续轮次 ≥ 25/35）
