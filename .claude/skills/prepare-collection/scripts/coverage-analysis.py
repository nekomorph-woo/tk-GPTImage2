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
import random
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent.parent
COLLECTED_DIR = PROJECT_ROOT / "collected"
SKIP_LIST = PROJECT_ROOT / ".claude/skills/collect-image-2-prompt/reference/skip-list.md"
CATEGORIES_FILE = SCRIPT_DIR.parent / "reference" / "search-categories.md"
SEARCH_HISTORY_FILE = PROJECT_ROOT / ".claude/skills/collect-image-2-prompt/scripts/.search-history.json"
RALPH_CMD_TEMPLATE = '/ralph-loop:ralph-loop "执行 /collect-image-2-prompt 本次执行搜索词：{query} 本次执行数量：{count} 本次执行排序：{sort}。每轮结束前执行：bash .claude/skills/collect-image-2-prompt/scripts/verify-collection.sh check {target} 仅当输出 ALL PASSED 时输出 promise 标签 COLLECT DONE" --completion-promise "COLLECT DONE" --max-iterations {max_iter}'
BASELINE_CMD = "bash .claude/skills/collect-image-2-prompt/scripts/verify-collection.sh init"
TIME_DECAY_THRESHOLD_HOURS = 48
SAMPLE_COUNTS = {
    "画风/艺术流派": 5,
    "摄影类型": 4,
    "摄影/打光技术": 3,
    "设计领域": 4,
    "商业/行业": 3,
    "场景/主题": 4,
    "人物/角色": 3,
    "文化/地域": 3,
    "技术格式": 2,
    "NSFW/成人内容": 2,
}


def load_categories() -> list[str]:
    if not CATEGORIES_FILE.exists():
        print(f"ERROR: categories file not found: {CATEGORIES_FILE}", file=sys.stderr)
        sys.exit(1)
    text = CATEGORIES_FILE.read_text(encoding="utf-8")
    return [c.strip() for line in text.splitlines() for c in line.split(",")
            if c.strip() and not c.strip().startswith("#")]


def load_categories_grouped() -> dict[str, list[str]]:
    if not CATEGORIES_FILE.exists():
        print(f"ERROR: categories file not found: {CATEGORIES_FILE}", file=sys.stderr)
        sys.exit(1)
    text = CATEGORIES_FILE.read_text(encoding="utf-8")
    grouped = {}
    current_section = "uncategorized"
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            current_section = stripped.lstrip("# ").strip()
            if current_section not in grouped:
                grouped[current_section] = []
            continue
        for cat in line.split(","):
            cat = cat.strip()
            if cat and current_section in grouped:
                grouped[current_section].append(cat)
    return grouped


def extract_from_file(filepath: Path) -> dict:
    text = filepath.read_text(encoding="utf-8")
    return {
        "tags": _extract_tags(text),
        "author": _extract_author(text),
        "search_term": _extract_search_term(text),
        "purpose": _extract_purpose(text),
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


def _extract_purpose(text: str) -> str:
    m = re.search(r"- \*\*用途\*\*:\s*(.+)", text)
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

    grouped = load_categories_grouped()
    all_cats = [c for cats in grouped.values() for c in cats]
    covered = set()
    for tag in tag_counter:
        for cat in all_cats:
            if cat.lower() in tag.lower() or tag.lower() in cat.lower():
                covered.add(cat)
                break
    for section, cats in grouped.items():
        gaps = [c for c in cats if c not in covered]
        if gaps:
            print(f"\n💡 [{section}] ({len(gaps)}): {', '.join(gaps[:8])}{'...' if len(gaps) > 8 else ''}")


def scan_search_history() -> list:
    if not SEARCH_HISTORY_FILE.exists():
        return []
    return json.loads(SEARCH_HISTORY_FILE.read_text(encoding="utf-8"))


def calc_time_decay(history: list) -> dict:
    now = datetime.now(timezone.utc)
    decay = {}
    for h in history:
        term = h["search_term"]
        if term in decay:
            continue
        if not h.get("start_time"):
            decay[term] = {"hours_since": None, "recommend_sort": "top"}
            continue
        try:
            started = datetime.fromisoformat(h["start_time"])
            hours = (now - started).total_seconds() / 3600
        except (ValueError, TypeError):
            hours = None
        if hours is not None and hours <= TIME_DECAY_THRESHOLD_HOURS:
            recommend = "live"
        else:
            recommend = "top"
        decay[term] = {
            "hours_since": round(hours, 1) if hours is not None else None,
            "recommend_sort": recommend,
        }
    return decay


def recommend() -> dict:
    entries, tag_counter, author_counter, term_counter = scan_collected()
    skips = count_skips()
    history = scan_search_history()
    time_decay = calc_time_decay(history)

    purposes = [e["purpose"] for e in entries if e["purpose"]]

    grouped = load_categories_grouped()
    all_cats = [c for cats in grouped.values() for c in cats]
    covered = set()
    for tag in tag_counter:
        for cat in all_cats:
            if cat.lower() in tag.lower() or tag.lower() in cat.lower():
                covered.add(cat)
                break
    coverage_gaps_by_group = {}
    for section, cats in grouped.items():
        gaps = [c for c in cats if c not in covered]
        if gaps:
            coverage_gaps_by_group[section] = gaps

    seen_terms = set()
    search_summary = []
    for h in history:
        term = h["search_term"]
        if term in seen_terms:
            continue
        seen_terms.add(term)
        td = time_decay.get(term, {})
        last_used = td.get("hours_since")
        if last_used is not None:
            if last_used < 1:
                last_used_str = f"{int(last_used * 60)}m ago"
            else:
                last_used_str = f"{int(last_used)}h ago"
        else:
            last_used_str = "unknown"
        times = sum(1 for hh in history if hh["search_term"] == term)
        total_collected_for_term = sum(hh.get("collected", 0) for hh in history if hh["search_term"] == term)
        search_summary.append({
            "term": term,
            "last_used": last_used_str,
            "times_used": times,
            "total_collected": total_collected_for_term,
            "sort_mode": h.get("sort_mode", "top"),
        })

    return {
        "current_collected": len(entries),
        "skipped": skips["total"],
        "skip_rate": round(skips["total"] / (len(entries) + skips["total"]), 2) if (len(entries) + skips["total"]) else 0,
        "coverage_gaps_by_group": coverage_gaps_by_group,
        "tag_distribution": dict(tag_counter.most_common()),
        "purpose_summary": purposes,
        "search_history_summary": search_summary,
        "time_decay_info": time_decay,
    }


def sample() -> dict:
    entries, tag_counter, author_counter, term_counter = scan_collected()
    skips = count_skips()
    history = scan_search_history()
    time_decay = calc_time_decay(history)

    grouped = load_categories_grouped()
    all_cats = [c for cats in grouped.values() for c in cats]
    covered = set()
    for tag in tag_counter:
        for cat in all_cats:
            if cat.lower() in tag.lower() or tag.lower() in cat.lower():
                covered.add(cat)
                break

    sampled = {}
    total_gaps = 0
    for section, cats in grouped.items():
        gaps = [c for c in cats if c not in covered]
        total_gaps += len(gaps)
        if not gaps:
            continue
        count = SAMPLE_COUNTS.get(section, 3)
        picked = random.sample(gaps, min(count, len(gaps)))
        sampled[section] = picked

    seen_terms = set()
    search_summary = []
    for h in history:
        term = h["search_term"]
        if term in seen_terms:
            continue
        seen_terms.add(term)
        td = time_decay.get(term, {})
        last_used = td.get("hours_since")
        if last_used is not None:
            last_used_str = f"{int(last_used)}m ago" if last_used < 1 else f"{int(last_used)}h ago"
        else:
            last_used_str = "unknown"
        search_summary.append({
            "term": term,
            "last_used": last_used_str,
            "sort_mode": h.get("sort_mode", "top"),
        })

    return {
        "current_collected": len(entries),
        "skipped": skips["total"],
        "sampled_gaps": sampled,
        "total_gaps": total_gaps,
        "tag_distribution_top20": dict(tag_counter.most_common(20)),
        "search_history_summary": search_summary,
        "time_decay_info": time_decay,
    }


def suggest(term: str, count: int) -> dict:
    entries, tag_counter, author_counter, term_counter = scan_collected()
    skips = count_skips()
    history = scan_search_history()
    time_decay = calc_time_decay(history)
    total = len(entries)
    total_processed = total + skips["total"]
    skip_rate = skips["total"] / total_processed if total_processed else 0.3

    used, matched, overlap = search_term_used(term, term_counter)

    td = time_decay.get(term, {})
    if td.get("hours_since") is not None:
        sort_mode = td["recommend_sort"]
    elif used:
        sort_mode = "live"
    else:
        sort_mode = "top"

    max_iter = math.ceil(count * 2.5)

    ralph_cmd = RALPH_CMD_TEMPLATE.format(
        query=term, count=count, sort=sort_mode, target=count, max_iter=max_iter,
    )

    return {
        "search_term_used": used,
        "matched_term": matched,
        "keyword_overlap": round(overlap, 2),
        "recommended_sort": sort_mode,
        "hours_since_previous": td.get("hours_since"),
        "current_collected": total,
        "target_new": count,
        "skip_rate": round(skip_rate, 2),
        "max_iterations": max_iter,
        "baseline_cmd": BASELINE_CMD,
        "ralph_cmd": ralph_cmd,
    }


def main():
    parser = argparse.ArgumentParser(description="收集状态分析")
    parser.add_argument("--suggest", nargs=2, metavar=("TERM", "COUNT"), help="推算模式：搜索词 + 数量")
    parser.add_argument("--recommend", action="store_true", help="推荐模式：输出结构化数据供 LLM 使用")
    parser.add_argument("--sample", action="store_true", help="抽样模式：每组随机抽样 gap 输出供 LLM 推荐")
    args = parser.parse_args()

    if args.sample:
        result = sample()
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif args.recommend:
        result = recommend()
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif args.suggest:
        term, count = args.suggest
        result = suggest(term, int(count))
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        entries, tag_counter, author_counter, term_counter = scan_collected()
        skips = count_skips()
        print_report(entries, tag_counter, author_counter, term_counter, skips)


if __name__ == "__main__":
    main()
