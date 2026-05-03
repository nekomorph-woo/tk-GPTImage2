#!/bin/bash
# 从 SKILL 输入内容中提取搜索词、目标数量和排序模式
# 输出格式：<URL编码搜索词>|<数量>|<排序模式>
INPUT="$1"
python3 -c "
import re, urllib.parse, sys

text = sys.argv[1]

# 提取数量
m_count = re.search(r'本次执行数量[：:]\s*(\d+)', text)
count = m_count.group(1) if m_count else '5'

# 提取排序模式（可选，默认 top）
m_sort = re.search(r'本次执行排序[：:]\s*(\w+)', text)
sort_mode = m_sort.group(1).strip().lower() if m_sort else 'top'

# 提取搜索词（遇到"本次执行数量"或"本次执行排序"或字符串末尾停止）
m_query = re.search(r'本次执行搜索词[：:]\s*(.+?)(?=\s*本次执行(?:数量|排序)|$)', text)
query = m_query.group(1).strip() if m_query else ''
encoded = urllib.parse.quote(query, safe='') if query else ''

print(f'{encoded}|{count}|{sort_mode}')
" "$INPUT"
