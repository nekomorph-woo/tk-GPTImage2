#!/usr/bin/env python3
"""搜索历史记录与查询。

用法:
  python3 search-history.py start --term "xxx" --sort top --target 50 --per-round 1
  python3 search-history.py end --id <id> --collected 13 --skipped 25
  python3 search-history.py query
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

HISTORY_FILE = Path(__file__).resolve().parent / ".search-history.json"
EMERGENCY_SCROLL_THRESHOLD = 8


def load_history() -> list:
    if not HISTORY_FILE.exists():
        return []
    return json.loads(HISTORY_FILE.read_text(encoding="utf-8"))


def save_history(history: list):
    HISTORY_FILE.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")


def normalize_keywords(term: str) -> set[str]:
    return set(re.findall(r"[\w]+", term.lower()))


def keyword_overlap(a: str, b: str) -> float:
    ka, kb = normalize_keywords(a), normalize_keywords(b)
    if not ka or not kb:
        return 0.0
    return len(ka & kb) / len(ka | kb)


def generate_id() -> str:
    now = datetime.now()
    date_part = now.strftime("%Y%m%d")
    history = load_history()
    today_count = sum(1 for h in history if h["id"].startswith(date_part))
    return f"{date_part}-{today_count + 1:03d}"


def find_last_similar(term: str, history: list) -> dict | None:
    best = None
    best_overlap = 0.0
    for h in reversed(history):
        if h.get("end_time") is None:
            continue
        overlap = keyword_overlap(term, h["search_term"])
        if overlap > best_overlap:
            best_overlap = overlap
            best = h
    return best


def hours_between(iso_a: str, iso_b: str) -> float | None:
    try:
        ta = datetime.fromisoformat(iso_a)
        tb = datetime.fromisoformat(iso_b)
        return abs((ta - tb).total_seconds() / 3600)
    except (ValueError, TypeError):
        return None


def cmd_start(args):
    history = load_history()
    term = args.term
    sort_mode = args.sort
    target = args.target
    per_round = args.per_round
    now = datetime.now(timezone.utc).isoformat()

    overlap = 0.0
    hours_since = None
    last_similar = find_last_similar(term, history)

    if last_similar:
        overlap = keyword_overlap(term, last_similar["search_term"])
        if last_similar.get("start_time"):
            hours_since = hours_between(now, last_similar["start_time"])

    entry = {
        "id": generate_id(),
        "search_term": term,
        "sort_mode": sort_mode,
        "target_count": target,
        "per_round_count": per_round,
        "start_time": now,
        "end_time": None,
        "collected": 0,
        "skipped": 0,
        "overlap_with_previous": round(overlap, 2),
        "hours_since_previous": round(hours_since, 1) if hours_since is not None else None,
    }

    history.append(entry)
    save_history(history)

    result = {"id": entry["id"], "overlap_with_previous": entry["overlap_with_previous"],
              "hours_since_previous": entry["hours_since_previous"]}
    print(json.dumps(result, ensure_ascii=False))


def cmd_end(args):
    history = load_history()
    sid = args.id
    for h in history:
        if h["id"] == sid:
            h["end_time"] = datetime.now(timezone.utc).isoformat()
            h["collected"] = args.collected
            h["skipped"] = args.skipped
            break
    save_history(history)
    print(json.dumps({"id": sid, "updated": True}))


def cmd_query(args):
    history = load_history()
    print(json.dumps(history, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser(description="搜索历史管理")
    sub = parser.add_subparsers(dest="command")

    p_start = sub.add_parser("start", help="记录搜索开始")
    p_start.add_argument("--term", required=True, help="搜索词")
    p_start.add_argument("--sort", default="top", choices=["top", "live"], help="排序模式")
    p_start.add_argument("--target", type=int, default=5, help="目标收集数")
    p_start.add_argument("--per-round", type=int, default=1, help="每轮收集数")

    p_end = sub.add_parser("end", help="更新搜索结束")
    p_end.add_argument("--id", required=True, help="搜索 ID")
    p_end.add_argument("--collected", type=int, default=0, help="收集数")
    p_end.add_argument("--skipped", type=int, default=0, help="跳过数")

    sub.add_parser("query", help="查询搜索历史")

    args = parser.parse_args()
    if args.command == "start":
        cmd_start(args)
    elif args.command == "end":
        cmd_end(args)
    elif args.command == "query":
        cmd_query(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
