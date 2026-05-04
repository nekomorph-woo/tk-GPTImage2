# 研究覆盖度

上次更新：2026-05-04

## 已完成研究

| # | 日期 | 研究方向 | 状态 | 平均分 | Recipe |
|---|------|---------|------|--------|--------|
| 1 | 2026-05-04 | 参考图驱动的角色一致性 | ✅ 通过 | 29.5/30 (98.3%) | `reference-driven-character-consistency` (confirmed) |
| 2 | 2026-05-04 | 角色设定集与多视角生成 | ❌ 未通过 | 19.5/30 (65%) | `character-reference-sheet-generation` (draft) |
| 3 | 2026-05-04 | 动漫风格一致性 Prompt 工程 | ✅ 通过 | 22.5/25 (90%) | `dna-template-character-consistency` (confirmed) |
| 4 | 2026-05-04 | 碧蓝航线专项角色一致性 | ⚠️ 部分通过 | Step1: 21/30, Step2: 16/25 | `azur-lane-character-consistency` (draft) |

## 关键发现

- **参考图驱动是最可靠的一致性方案**：98.3% 通过率，适合有参考图的场景
- **纯文本 DNA Template 有效但略逊**：90% 通过率，适合无参考图的原创角色
- **多面板角色设定集超出当前模型能力**：GPT Image 2 无法在单次生成中可靠产出结构化设定集
- **碧蓝航线航母角色一致性高于驱逐舰**：大型舰装比小型舰装更容易在场景编辑中保持一致

## Recipes 状态总览

| Recipe | 状态 | 核心价值 |
|--------|------|---------|
| `reference-driven-character-consistency` | ✅ confirmed | 参考图 + 编辑模式两步工作流 |
| `dna-template-character-consistency` | ✅ confirmed | 纯文本 DNA 文档 + 重发一致性声明 |
| `azur-lane-character-consistency` | draft | 碧蓝航线专属 DNA 格式 + 舰装分层描述 |
| `character-reference-sheet-generation` | draft | 日系角色设定集（当前模型能力有限） |

## 覆盖缺口

- [ ] 多角色同场景一致性（已有 pattern 未独立验证）
- [ ] 风格迁移 + 角色保持（已有 pattern 未独立验证）
- [ ] 链式编辑迭代稳定性（多轮编辑漂移情况）
- [ ] 更多碧蓝航线角色类型的泛化验证（重巡、轻巡、战列舰）
