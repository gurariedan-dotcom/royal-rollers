#!/bin/bash
# Auto-backup script for Royal Rollers

cd /Users/Work/Downloads/royal-rollers

# Check if there are changes
if git diff --quiet && git diff --cached --quiet; then
  exit 0
fi

# Commit with timestamp
git add -A
git commit -m "Auto-backup: $(date '+%Y-%m-%d %H:%M:%S')" --no-verify 2>/dev/null || true

# Push to GitHub
git push origin main 2>/dev/null || true
