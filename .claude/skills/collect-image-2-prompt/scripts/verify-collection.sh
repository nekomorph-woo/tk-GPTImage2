#!/bin/bash
# verify-collection.sh — Ralph Loop 收集数量与结构验证
#
# 用法:
#   bash verify-collection.sh init              # 记录当前 collected/ 文件数作为基线
#   bash verify-collection.sh check <target>    # 检查新增数量是否达标 + 结构完整性
#
# init 输出: BASELINE: N files
# check 输出:
#   ALL PASSED: N new files collected    → 可输出 <promise>
#   NEED MORE: ...                       → 继续循环
#
# ──────────────────────────────────────────────────────────────────
# 与 /ralph-loop 配合使用的完整流程:
#
#   # 1. 记录基线
#   bash .claude/skills/collect-image-2-prompt/scripts/verify-collection.sh init
#
#   # 2. 启动 Ralph Loop
#   /ralph-loop "
#   执行 /collect-image-2-prompt 本次执行搜索词：gpt-image-2 prompt animate 本次执行数量：1。
#   每轮结束前执行：
#   bash .claude/skills/collect-image-2-prompt/scripts/verify-collection.sh check 10
#   仅当输出 ALL PASSED 时输出 <promise>COLLECT DONE</promise>
#   " --completion-promise "COLLECT DONE" --max-iterations 30
# ──────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
COLLECTED_DIR="$PROJECT_ROOT/collected"
STATE_FILE="$SCRIPT_DIR/.ralph-baseline"

case "$1" in
  init)
    COUNT=$(find "$COLLECTED_DIR" -name "*.md" -maxdepth 1 2>/dev/null | wc -l | tr -d ' ')
    echo "$COUNT" > "$STATE_FILE"
    echo "BASELINE: $COUNT files"
    ;;
  check)
    TARGET="$2"
    if [ -z "$TARGET" ]; then
      echo "NEED MORE: missing target count"
      exit 1
    fi
    BASELINE=$(cat "$STATE_FILE" 2>/dev/null || echo "0")
    CURRENT=$(find "$COLLECTED_DIR" -name "*.md" -maxdepth 1 2>/dev/null | wc -l | tr -d ' ')
    NEW=$((CURRENT - BASELINE))
    if [ "$NEW" -ge "$TARGET" ]; then
      echo "ALL PASSED: $NEW new files collected"
    else
      echo "NEED MORE: collected $NEW / $TARGET target"
    fi
    ;;
  *)
    echo "Usage: verify-collection.sh {init|check <target>}"
    exit 1
    ;;
esac
