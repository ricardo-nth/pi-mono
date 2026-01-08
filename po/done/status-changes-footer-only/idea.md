---
title: Status Changes in Footer Only
area: global
implementation: core
effort: low
impact: medium
risk: low
status: done
files:
  - packages/coding-agent/src/modes/interactive/interactive-mode.ts
extensionApi: null
created: 2026-01-06
---

# Status Changes in Footer Only

When changing model or thinking level, show it only in the footer - don't print messages to the chat buffer.

## Current Behavior

### Thinking Level
```
Thinking level: minimal        ← buffer (redundant)
```
Footer: `claude-sonnet-4-5 • minimal`

### Model Switch
```
Switched to Claude Opus 4.5 (latest)    ← buffer (redundant)
```
Footer: `claude-opus-4-5-20251101`

## Proposed Behavior

No buffer messages for either. The footer already shows:
- Current model name
- Current thinking level (if reasoning model)

These buffer messages are noise since the footer is always visible.

## Why Core Change

Both buffer messages are generated in `interactive-mode.ts`. Would need to suppress or remove those print statements.

## Scope

| Change | Buffer Message | Footer Shows |
|--------|----------------|--------------|
| Model switch | Remove | Model name |
| Thinking level | Remove | `model • level` |

## Screenshot Reference

See `assets/` - shows redundant display for both cases.
