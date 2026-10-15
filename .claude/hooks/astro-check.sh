#!/usr/bin/env bash
# PostToolUse hook: run `astro check` after edits to data or content files.
file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  */src/data/*|*/src/content/*|*/src/content.config.ts) ;;
  *) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR" || exit 0
if ! out=$(npx astro check 2>&1); then
  echo "$out" | tail -40 >&2
  exit 2
fi
