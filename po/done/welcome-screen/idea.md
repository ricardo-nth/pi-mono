---
title: Clean Welcome Screen
area: global
implementation: hybrid
effort: medium
impact: high
risk: low
status: done
files:
  - packages/coding-agent/src/modes/interactive/interactive-mode.ts
  - packages/coding-agent/src/modes/interactive/components/info-viewer.ts
extensionApi: session_start hook, ctx.ui.custom(), ctx.ui.setWidget()
created: 2026-01-06
depends:
  - toast-notifications
---

# Clean Welcome Screen

Replace the cluttered startup info dump with a minimal welcome and toast notifications.

## Current Behavior

On startup, shows (in order):
1. ~~Hotkeys list (15+ lines)~~ ✅ DONE - moved to `?` popup
2. ~~Loaded context files (lengthy paths)~~ ✅ DONE - now `/context` command
3. ~~Loaded skills (lengthy paths)~~ ✅ DONE - now `/skills` command  
4. ~~Loaded extensions~~ ✅ DONE - now `/extensions` command
5. ~~"Switched to [model]"~~ ✅ DONE - footer only now

Now shows: `Loaded: 2 context, 4 skills, 1 extension ─ /context /skills /extensions to view`

## Proposed Behavior

### Minimal Launch
```
pi v0.37.3
Press ? for shortcuts
```

### Toast Notifications (brief, fade out)
```
┌─────────────┐
│ 2 contexts  │  ← fades after 3s
│ 4 skills    │
│ 1 extension │
└─────────────┘
```

### Hotkeys via `?` Popup
See: `hotkeys-popup` idea

## What Moves Where

| Current | New Location |
|---------|--------------|
| Hotkeys list | `?` popup (hotkeys-popup) |
| Loaded context | Toast notification |
| Loaded skills | Toast notification |
| Loaded extensions | Toast notification |
| Model switch | Footer only (status-changes-footer-only) |

## Dependencies

This idea requires:
1. ~~**popups-above-input**~~ ✅ DONE
2. **toast-notifications** - for the loaded context/skills toasts
3. ~~**hotkeys-popup**~~ ✅ DONE

## Implementation

### Phase 1: Core Change (Remove Clutter) ✅ DONE
In `interactive-mode.ts`:
- ~~Remove hotkeys list from launch~~ ✅
- ~~Shorten or remove context/skills paths~~ ✅ Now shows compact summary with counts
- ~~Remove model switch message~~ ✅

Added:
- `/context` command with `InfoViewerComponent` popup
- `/skills` command with `InfoViewerComponent` popup
- `/extensions` command with `InfoViewerComponent` popup
- Compact startup hint: `Loaded: X context, Y skills, Z extensions ─ /context /skills /extensions to view`

### Phase 2: Extension (Add Toast) - OPTIONAL
Via extension:
- On `session_start`, show toast with counts
- Use `ctx.ui.setWidget()` for brief notification

## ASCII Art Banner (Goal)

Replace the wall of text with clean ASCII art:

```
    ___  _
   / _ \(_)
  / ___// /
 /_/   /_/

 v0.37.3 • ? for help
```

Config in `~/.pi/agent/settings.json`:
```json
{
  "welcome": {
    "showAscii": true,
    "showVersion": true
  }
}
```

## Notes

- Keep it minimal - users want to start working, not read
- Toast should be unobtrusive and auto-dismiss
- `?` hint is the key affordance for discovering shortcuts
