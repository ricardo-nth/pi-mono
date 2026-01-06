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
