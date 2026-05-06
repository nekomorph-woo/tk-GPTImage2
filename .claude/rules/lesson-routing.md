# 经验/教训路由

当用户要求总结经验、记录教训、或表达"你学到了什么"时，根据当前上下文判断处理方式：

| 上下文 | 动作 |
|--------|------|
| 正在执行或改进某个 SKILL | 将经验写入该 SKILL 的 SKILL.md（改进流程/脚本/检查清单） |
| 其他场景 | 按 MEMORY.md 规范写入项目 memory 系统 |

**MEMORY.md 路径**：项目根目录 `memory/MEMORY.md`（索引文件），具体记忆写入 `memory/` 下的独立 `.md` 文件。

**判断依据**：回顾最近几轮对话中是否涉及 SKILL 的执行（如 `/image-to-prompt`、`/collect-image-2-prompt` 等）或 SKILL 文件的编辑讨论。若是，则经验与该 SKILL 的执行质量直接相关，应固化到 SKILL 中使其成为持久行为约束。
