#!/usr/bin/env bash
set -euo pipefail
VIDEO="${1:-video.mp4}"
mkdir -p full
ffmpeg -i "$VIDEO" -vf "fps=24,scale=1600:900" -start_number 0 full/f%03d.png
ffmpeg -i "$VIDEO" -filter:v "select='gte(scene,0)',metadata=print" -f null - 2> scene-cuts.txt || true
