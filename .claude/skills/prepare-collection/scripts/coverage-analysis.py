#!/usr/bin/env python3
"""收集状态分析：覆盖度报告、搜索词去重、指令推算。

用法:
  python3 coverage-analysis.py                         # 覆盖度报告
  python3 coverage-analysis.py --suggest "搜索词" 数量   # JSON 推算结果
"""

import argparse
import json
import math
import os
import re
import sys
from collections import Counter
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent.parent
COLLECTED_DIR = PROJECT_ROOT / "collected"
SKIP_LIST = PROJECT_ROOT / ".claude/skills/collect-image-2-prompt/reference/skip-list.md"
CATEGORIES_FILE = SCRIPT_DIR.parent / "reference" / "search-categories.md"
RALPH_CMD_TEMPLATE = '/ralph-loop:ralph-loop "执行 /collect-image-2-prompt 本次执行搜索词：{query} 本次执行数量：{count} 本次执行排序：{sort}。每轮结束前执行：bash .claude/skills/collect-image-2-prompt/scripts/verify-collection.sh check {target} 仅当输出 ALL PASSED 时输出 promise 标签 COLLECT DONE" --completion-promise "COLLECT DONE" --max-iterations {max_iter}'
BASELINE_CMD = "bash .claude/skills/collect-image-2-prompt/scripts/verify-collection.sh init"


def load_categories() -> list[str]:
    if CATEGORIES_FILE.exists():
        text = CATEGORIES_FILE.read_text(encoding="utf-8")
        return [c.strip() for c in text.split(",") if c.strip()]
    return [
        "portrait", "poster", "comic", "infographic", "food", "fashion",
        "storyboard", "children-book", "product-ad", "identity", "logo",
        "UI/UX", "architecture", "landscape", "typography", "texture",
        "3D-render", "character-design", "photography", "illustration",
        "packaging", "motion/animation",
    ]


def extract_from_file(filepath: Path) -> dict:
    text = filepath.read_text(encoding="utf-8")
    return {
        "tags": _extract_tags(text),
        "author": _extract_author(text),
        "search_term": _extract_search_term(text),
    }


def _extract_tags(text: str) -> list[str]:
    m = re.search(r"## 标签\s*\n+(.*?)(?:\n## |\n$)", text, re.DOTALL)
    if not m:
        return []
    return [t.strip() for t in m.group(1).replace("\n", " ").split(",") if t.strip()]


def _extract_author(text: str) -> str:
    m = re.search(r"- \*\*来源\*\*:.*?@([\w_]+)", text)
    return m.group(1) if m else ""


def _extract_search_term(text: str) -> str:
    m = re.search(r"- \*\*搜索词\*\*:\s*(.+)", text)
    return m.group(1).strip() if m else ""


def count_skips() -> dict:
    if not SKIP_LIST.exists():
        return {"r3": 0, "r4": 0, "total": 0}
    text = SKIP_LIST.read_text(encoding="utf-8")
    r3 = text.count("| R3 |")
    r4 = text.count("| R4 |")
    return {"r3": r3, "r4": r4, "total": r3 + r4}


def normalize_keywords(term: str) -> set[str]:
    return set(re.findall(r"[\w]+", term.lower()))


def keyword_overlap(a: str, b: str) -> float:
    ka, kb = normalize_keywords(a), normalize_keywords(b)
    if not ka or not kb:
        return 0.0
    return len(ka & kb) / len(ka | kb)


def search_term_used(input_term: str, history: dict, threshold: float = 0.7) -> tuple[bool, str, float]:
    best_overlap = 0.0
    best_match = ""
    for term in history:
        overlap = keyword_overlap(input_term, term)
        if overlap > best_overlap:
            best_overlap = overlap
            best_match = term
    return (best_overlap >= threshold, best_match, best_overlap)


def scan_collected() -> tuple[list[dict], Counter, Counter, dict]:
    files = sorted(COLLECTED_DIR.glob("[0-9]*.md"))
    entries = []
    tag_counter = Counter()
    author_counter = Counter()
    term_counter = Counter()

    for f in files:
        data = extract_from_file(f)
        entries.append(data)
        for t in data["tags"]:
            tag_counter[t] += 1
        if data["author"]:
            author_counter[data["author"]] += 1
        if data["search_term"]:
            term_counter[data["search_term"]] += 1

    return entries, tag_counter, author_counter, dict(term_counter)


def print_report(entries, tag_counter, author_counter, term_counter, skips):
    total = len(entries)
    total_processed = total + skips["total"]
    skip_rate = skips["total"] / total_processed if total_processed else 0

    print("📊 收集状态报告")
    print("─" * 31)
    print(f"已收集: {total}  |  已跳过: {skips['total']}  |  跳过率: {skip_rate:.0%}")

    print("\n🔍 搜索词历史:")
    for term, count in sorted(term_counter.items(), key=lambda x: -x[1]):
        print(f"  {term} ({count}条)")

    print("\n🏷️  标签覆盖 TOP 15:")
    for tag, count in tag_counter.most_common(15):
        print(f"  {tag}({count})", end="")
    print()

    print("\n👤 高产作者 TOP 10:")
    for author, count in author_counter.most_common(10):
        print(f"  @{author}({count})", end="")
    print()

    categories = load_categories()
    covered = set()
    for tag in tag_counter:
        for cat in categories:
            if cat.lower() in tag.lower() or tag.lower() in cat.lower():
                covered.add(cat)
                break
    low = [c for c in categories if c not in covered]
    if low:
        print(f"\n💡 低覆盖领域: {', '.join(low)}")


def suggest(term: str, count: int) -> dict:
    entries, tag_counter, author_counter, term_counter = scan_collected()
    skips = count_skips()
    total = len(entries)
    total_processed = total + skips["total"]
    skip_rate = skips["total"] / total_processed if total_processed else 0.3

    used, matched, overlap = search_term_used(term, term_counter)
    sort_mode = "live" if used else "top"
    target = total + count
    max_iter = math.ceil(count * 2.5)

    ralph_cmd = RALPH_CMD_TEMPLATE.format(
        query=term, count=count, sort=sort_mode, target=target, max_iter=max_iter,
    )

    return {
        "search_term_used": used,
        "matched_term": matched,
        "keyword_overlap": round(overlap, 2),
        "recommended_sort": sort_mode,
        "current_collected": total,
        "target_total": target,
        "skip_rate": round(skip_rate, 2),
        "max_iterations": max_iter,
        "baseline_cmd": BASELINE_CMD,
        "ralph_cmd": ralph_cmd,
    }


def main():
    parser = argparse.ArgumentParser(description="收集状态分析")
    parser.add_argument("--suggest", nargs=2, metavar=("TERM", "COUNT"), help="推算模式：搜索词 + 数量")
    args = parser.parse_args()

    if args.suggest:
        term, count = args.suggest
        result = suggest(term, int(count))
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        entries, tag_counter, author_counter, term_counter = scan_collected()
        skips = count_skips()
        print_report(entries, tag_counter, author_counter, term_counter, skips)


if __name__ == "__main__":
    main()
