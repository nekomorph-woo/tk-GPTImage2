#!/usr/bin/env python3
"""
去重检查脚本：判断新 prompt 是否与 collected/ 中已有 prompt 重复
用法: python3 scripts/dedup-check.py "<prompt文本>" "<collected目录>"
输出:
  JSON {"duplicate": true/false, "matched_file": "...", "jaccard": 0.xx, "threshold": 0.75}
  或 JSON {"duplicate": false, "threshold": 0.75}（无重复）
"""
import re, os, sys, json

THRESHOLD = 0.75

def normalize(text):
    """标准化：小写 + 去标点 + 去多余空白 + 分词"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9一-鿿\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return set(text.split())

def jaccard(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

def extract_prompt(filepath):
    """从 collected markdown 文件中提取 Prompt 节的内容"""
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'## Prompt\s*\n(.*?)(?=\n## )', content, re.DOTALL)
    if not m:
        return ''
    return m.group(1).strip()

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: dedup-check.py <prompt> <collected_dir>"}))
        sys.exit(1)

    new_prompt = sys.argv[1]
    collected_dir = sys.argv[2]
    new_words = normalize(new_prompt)

    if not new_words:
        print(json.dumps({"duplicate": False, "reason": "empty prompt", "threshold": THRESHOLD}))
        return

    best_match = None
    best_sim = 0.0

    for filename in sorted(os.listdir(collected_dir)):
        if not filename.endswith('.md'):
            continue
        filepath = os.path.join(collected_dir, filename)
        existing_prompt = extract_prompt(filepath)
        if not existing_prompt:
            continue
        existing_words = normalize(existing_prompt)
        if not existing_words:
            continue
        sim = jaccard(new_words, existing_words)
        if sim > best_sim:
            best_sim = sim
            best_match = filename

    if best_sim >= THRESHOLD:
        print(json.dumps({
            "duplicate": True,
            "matched_file": best_match,
            "jaccard": round(best_sim, 3),
            "threshold": THRESHOLD
        }))
    else:
        print(json.dumps({
            "duplicate": False,
            "best_match": best_match,
            "jaccard": round(best_sim, 3),
            "threshold": THRESHOLD
        }))

if __name__ == '__main__':
    main()
