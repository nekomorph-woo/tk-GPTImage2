#!/usr/bin/env python3
"""运行时状态管理。

用法:
  python3 runtime-state.py init --id <search_id>
  python3 runtime-state.py skip
  python3 runtime-state.py collect
  python3 runtime-state.py cleanup
"""

import argparse
import json
import sys
from pathlib import Path

STATE_FILE = Path(__file__).resolve().parent / ".runtime-state.json"
EMERGENCY_THRESHOLD = 8
EMERGENCY_FAIL_SWITCH_THRESHOLD = 3


def load_state() -> dict:
    if not STATE_FILE.exists():
        return {}
    return json.loads(STATE_FILE.read_text(encoding="utf-8"))


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def cmd_init(args):
    state = {
        "search_id": args.id,
        "consecutive_skips": 0,
        "total_skips": 0,
        "total_collected": 0,
        "consecutive_emergency_fails": 0,
        "current_sort_mode": args.sort,
    }
    save_state(state)
    print(json.dumps({"initialized": True, "id": args.id}))


def cmd_skip(args):
    state = load_state()
    if not state:
        print(json.dumps({"error": "not initialized"}))
        sys.exit(1)
    state["consecutive_skips"] += 1
    state["total_skips"] += 1
    save_state(state)
    should = state["consecutive_skips"] >= EMERGENCY_THRESHOLD
    print(json.dumps({
        "consecutive_skips": state["consecutive_skips"],
        "total_skips": state["total_skips"],
        "should_emergency_scroll": should,
    }))


def cmd_collect(args):
    state = load_state()
    if not state:
        print(json.dumps({"error": "not initialized"}))
        sys.exit(1)
    state["consecutive_skips"] = 0
    state["total_collected"] += 1
    save_state(state)
    print(json.dumps({
        "consecutive_skips": 0,
        "total_collected": state["total_collected"],
    }))


def cmd_cleanup(args):
    if STATE_FILE.exists():
        STATE_FILE.unlink()
    print(json.dumps({"cleaned": True}))


def cmd_emergency_fail(args):
    state = load_state()
    if not state:
        print(json.dumps({"error": "not initialized"}))
        sys.exit(1)
    state["consecutive_emergency_fails"] += 1
    save_state(state)
    should_switch = (state["consecutive_emergency_fails"] >= EMERGENCY_FAIL_SWITCH_THRESHOLD
                     and state.get("current_sort_mode") != "top")
    print(json.dumps({
        "consecutive_emergency_fails": state["consecutive_emergency_fails"],
        "should_switch_to_top": should_switch,
        "current_sort_mode": state.get("current_sort_mode"),
    }))


def cmd_emergency_success(args):
    state = load_state()
    if not state:
        print(json.dumps({"error": "not initialized"}))
        sys.exit(1)
    state["consecutive_emergency_fails"] = 0
    save_state(state)
    print(json.dumps({"consecutive_emergency_fails": 0}))


def main():
    parser = argparse.ArgumentParser(description="运行时状态管理")
    sub = parser.add_subparsers(dest="command")

    p_init = sub.add_parser("init", help="初始化状态")
    p_init.add_argument("--id", required=True, help="搜索 ID")
    p_init.add_argument("--sort", default="top", choices=["top", "live"], help="排序模式")

    sub.add_parser("skip", help="记录跳过")
    sub.add_parser("collect", help="记录收集")
    sub.add_parser("emergency_fail", help="记录紧急滚动失败")
    sub.add_parser("emergency_success", help="重置紧急滚动失败计数")
    sub.add_parser("cleanup", help="清理状态文件")

    args = parser.parse_args()
    if args.command == "init":
        cmd_init(args)
    elif args.command == "skip":
        cmd_skip(args)
    elif args.command == "collect":
        cmd_collect(args)
    elif args.command == "emergency_fail":
        cmd_emergency_fail(args)
    elif args.command == "emergency_success":
        cmd_emergency_success(args)
    elif args.command == "cleanup":
        cmd_cleanup(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
