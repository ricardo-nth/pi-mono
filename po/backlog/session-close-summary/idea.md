---
title: Session Close Summary
area: global
implementation: extension
effort: medium
impact: high
risk: low
status: idea
files: []
extensionApi: session_end hook (if exists), ctx.ui.custom()
created: 2025-01-06
---

# Session Close Summary

Like Codex, show useful information when closing a session.

## Current Behavior

- Ctrl+C: exits immediately
- Ctrl+D: exits immediately
- No confirmation, no summary

## Proposed Behavior

### Ctrl+C (first press)
```
Press Ctrl+C again to exit, or continue typing...
```

### On Exit (Ctrl+C x2 or Ctrl+D)
```
Session ended.

Resume: po --resume abc123

Summary:
  Input:  23,456 tokens
  Output: 12,789 tokens
  Cached: 45,123 tokens
  Cost:   $0.074
```

## Implementation

1. Track Ctrl+C state (first press vs second)
2. On exit, calculate session totals
3. Generate resume command with session ID
4. Display formatted summary

## Files to Investigate

- `interactive-mode.ts` - handles input/exit
- `agent-session.ts` - has session state and ID
- `session-manager.ts` - session persistence

## Notes

- This is where cache stats make most sense (not always-visible footer)
- Resume command is very useful
- High complexity due to signal handling and session management

## Status (2026-01-09) - Still Needs Core Investigation

Checked upstream v0.39.0-v0.42.0 changes - **no `session_end` hook found** in the extension API.

Available hooks are:
- `session_start` - fires when session begins
- `before_agent_start` - fires before agent runs
- `after_agent_end` - fires after agent completes a turn

To implement session close summary, we'd need either:
1. **Core change**: Add signal handling in `interactive-mode.ts` to show summary before exit
2. **New hook**: Request `session_end` hook from upstream
3. **Workaround**: Use `after_agent_end` to update a "last summary" that could be shown on exit

This remains a **core** or **hybrid** implementation - can't do it purely via extension yet.
