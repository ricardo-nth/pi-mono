---
name: park
description: Park current active feature back to backlog. Preserves all progress.
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Park Feature

Move an active feature back to backlog (e.g., when interrupted or blocked).

## Process

1. List features in `po/active/`
2. If multiple, ask which one to park
3. Move folder from `po/active/<feature>/` to `po/backlog/<feature>/`
4. Update idea.md status back to "ready" (preserves PRD progress)
5. Confirm parked

## Note

Progress is preserved - prd.json and any work stays in the folder.
When you return to it, just run /start-feature again.
