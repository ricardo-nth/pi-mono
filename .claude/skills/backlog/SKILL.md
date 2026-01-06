---
name: backlog
description: List all ideas in the PO backlog, sorted by computed priority (impact/effort ratio).
allowed-tools: Read, Glob, Bash
---

# View PO Backlog

List all ideas in `po/backlog/` with computed priorities.

## Process

1. Glob for all `po/backlog/*/idea.md` files
2. Parse front matter from each
3. Compute priority score:
   - high impact + low effort = 3 (quick win)
   - high impact + medium effort = 2
   - medium impact + low effort = 2
   - high impact + high effort = 1 (major feature)
   - medium impact + medium effort = 1
   - low impact + low effort = 1
   - others = 0 (reconsider)
4. Sort by priority score descending

## Output

Display as table:

| Priority | Title | Area | Effort | Impact | Risk |
|----------|-------|------|--------|--------|------|
| ★★★ | Footer Icons | footer | low | high | low |
| ★★ | Favorites | model-selector | medium | high | low |

If backlog is empty, say so.
