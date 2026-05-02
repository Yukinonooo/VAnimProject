#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   bash publish_to_github.sh <github_repo_url>
# Example:
#   bash publish_to_github.sh git@github.com:YOUR_NAME/VAnimProject.git

if [[ $# -ne 1 ]]; then
  echo "Usage: bash publish_to_github.sh <github_repo_url>"
  exit 1
fi

REPO_URL="$1"
PROJECT_DIR="/data/common/lgt/VAnimProject"

cd "$PROJECT_DIR"

echo "[1/6] Initialize git repository if needed..."
if [[ ! -d .git ]]; then
  git init
fi

echo "[2/6] Ensure branch is main..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  git checkout -B main
fi

echo "[3/6] Add remote origin..."
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "[4/6] Stage files..."
git add .

echo "[5/6] Commit..."
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "Build VAnim project page"
fi

echo "[6/6] Push to GitHub..."
git push -u origin main

echo "Done."
echo "If you want GitHub Pages: repo Settings -> Pages -> Deploy from branch 'main' (root)."
