#!/bin/bash
# 从 SKILL 输入内容中提取搜索词和目标数量
# 输出格式：<URL编码搜索词>|<数量>
INPUT="$1"
python3 -c "
import re, urllib.parse, sys

text = sys.argv[1]

# 提取数量
m_count = re.search(r'本次执行数量[：:]\s*(\d+)', text)
count = m_count.group(1) if m_count else '5'

# 提取搜索词（遇到"本次执行数量"或字符串末尾停止）
m_query = re.search(r'本次执行搜索词[：:]\s*(.+?)(?=\s*本次执行数量|$)', text)
query = m_query.group(1).strip() if m_query else ''
encoded = urllib.parse.quote(query, safe='') if query else ''

print(f'{encoded}|{count}')
" "$INPUT"
