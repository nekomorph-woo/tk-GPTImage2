#!/bin/bash
# 清理 bb-browser snapshot 产生的覆盖层和 ref 数字标签
# 用法: bash scripts/cleanup-overlays.sh <tab-id>

TAB="${1:?$0: 缺少参数 <tab-id>}" \
  && bb-browser eval "document.querySelectorAll('div[style*=\"pointer-events: none\"][style*=\"border: 2px solid\"]').forEach(e => e.remove())" --tab "$TAB" \
  && bb-browser eval "document.querySelectorAll('div[style*=\"z-index: 2147483647\"][style*=\"pointer-events: none\"]').forEach(e => e.remove())" --tab "$TAB"
