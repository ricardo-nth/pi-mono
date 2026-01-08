---
title: Hotkeys Popup
area: global
implementation: extension
effort: medium
impact: high
risk: low
status: done
files: []
extensionApi: ctx.ui.custom(), registerCommand()
created: 2026-01-06
depends:
  - popups-above-input
---

# Hotkeys Popup

Replace the launch screen hotkey list with an on-demand popup triggered by `?`.

## Current Behavior

Hotkeys shown at launch:
```
pi v0.37.3
escape to interrupt
ctrl+c to clear
ctrl+c twice to exit
... (15+ lines)
```

Problem: Scrolls off screen immediately when context/skills load below.

## Proposed Behavior

- No hotkeys at launch
- Press `?` to open hotkeys popup
- Press `?` again or `Escape` to close
- Similar to settings panel UX

## Popup Design

```
┌─────────────────────────────────────┐
│  Keyboard Shortcuts                 │
├─────────────────────────────────────┤
│  Navigation                         │
│  ─────────                          │
│  Escape     Interrupt               │
│  Ctrl+C     Clear / Exit (2x)       │
│  Ctrl+L     Select model            │
│  Ctrl+O     Expand tools            │
│                                     │
│  Editing                            │
│  ───────                            │
│  Ctrl+K     Delete line             │
│  Ctrl+G     External editor         │
│  Alt+Enter  Queue follow-up         │
│                                     │
│  [?] or [Esc] to close              │
└─────────────────────────────────────┘
```

## Implementation

Via extension using `ctx.ui.custom()`:

```typescript
pi.registerCommand("hotkeys", {
  description: "Show keyboard shortcuts",
  handler: async (_args, ctx) => {
    await ctx.ui.custom((tui, theme, done) => {
      // Render hotkeys panel
      // Handle ? or Escape to close
      return hotkeysPanelComponent;
    });
  }
});

// Also register ? as global keybind if possible
```

## Dependencies

- **popups-above-input**: For sticky footer feel, popup should appear above input
- **welcome-screen**: Remove hotkeys from launch once this exists

## Notes

- Grouped by category (Navigation, Editing, etc.)
- Could be part of command-palette later (add "Hotkeys" tab)
