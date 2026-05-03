#!/usr/bin/env bash
# 拟人化随机延迟
# Usage: bash human-delay.sh [min_sec] [max_sec]
# Default: min=1, max=3
MIN=${1:-1}
MAX=${2:-3}
DELAY=$(python3 -c "import random; print(f'{random.uniform($MIN, $MAX):.1f}')")
sleep "$DELAY"
