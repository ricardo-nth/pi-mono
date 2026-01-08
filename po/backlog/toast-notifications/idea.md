---
title: Toast Notifications
area: header
implementation: hybrid
effort: medium
impact: medium
risk: medium
status: blocked
files:
  - packages/tui/src/tui.ts
extensionApi: ctx.ui.setWidget() for basic version
created: 2026-01-06
---

# Toast Notifications

Display loaded context and skills as toast notifications in the top right, fading after a delay.

## Levels of Implementation

### Level 1: Toast Notifications
- On startup, show toast notifications in top right corner
- Display: "Loaded context: CLAUDE.md" etc.
- Display: "Loaded skills: /commit, /plan" etc.
- Fade out after 3-5 seconds
- Stack multiple toasts if needed

### Level 2: Sidebar (Future)
- Similar to OpenCode's sidebar
- Persistent view of loaded context and skills
- Toggle with hotkey

### Level 3: Viewable via Command Palette
- Add command to view currently loaded context/skills
- Opens in command palette or dedicated view
- Available via hotkey (e.g., Ctrl+I for info)

## Visual Concept

```
┌─────────────────────────────────┐
│                    ┌──────────┐ │
│                    │ Loaded   │ │
│                    │ CLAUDE.md│ │
│                    └──────────┘ │
│  Welcome to Pi...  ┌──────────┐ │
│                    │ Skills   │ │
│                    │ /commit  │ │
│                    │ /plan    │ │
│                    └──────────┘ │
│                                 │
└─────────────────────────────────┘
```

After delay, toasts fade out leaving clean interface.

## Research Notes (2026-01-06)

### What `ctx.ui.notify()` Actually Does

**NOT a toast notification.** It's an inline status message added to the chat area:

```typescript
private showExtensionNotify(message: string, type?: "info" | "warning" | "error"): void {
  if (type === "error") {
    this.showError(message);
  } else if (type === "warning") {
    this.showWarning(message);
  } else {
    this.showStatus(message);  // Inline in chat
  }
}
```

### Why True Toasts Are Hard

The TUI has **no z-index or layering** support. Components stack vertically, can't overlap. To show a toast in the top-right corner floating over content, we'd need:

1. **Composite rendering**: Render main content, then overlay toast on specific lines
2. **Position calculation**: Know terminal dimensions, calculate toast position
3. **Timer management**: Auto-dismiss after delay
4. **Animation**: Fade effect (challenging in terminal)

### Alternative: Widget-Based Toasts

Could use `ctx.ui.setWidget()` to show notifications above the editor:

```typescript
ctx.ui.setWidget("toast", ["Loaded: CLAUDE.md"]);
setTimeout(() => ctx.ui.setWidget("toast", undefined), 3000);
```

- Pro: Works today via extension
- Con: Not floating, not in corner, basic

### Proper Implementation

Would require TUI enhancement for overlay rendering - similar complexity to sticky footer.

## Why Effort is High (Revised)

- Original estimate: medium
- Revised estimate: **high**
- Reason: TUI lacks overlay/layering capability
- Same fundamental limitation as sticky footer

## Quick Win Alternative

Use `ctx.ui.setWidget()` for a simpler "notification area" above the editor. Not true toasts, but achievable today via extension.

## Notes

- Cleaner than current inline "Loaded context" messages
- Non-intrusive but informative
- Foundation for more notification types later

## Status: Blocked (2026-01-08)

TUI doesn't support true overlay/toast rendering. The closest equivalent is **widgets** (`ctx.ui.setWidget()`), which:
- Render above the editor (not floating)
- Can auto-dismiss with `setTimeout`
- Work well for transient notifications

**Re-imagine as:** Widget-based notifications for:
- Background task status (if/when supported)
- Errors or warnings
- Agent handoff notifications
- Anything that benefits from timed display

Not useful for hot-reload notifications since skills/extensions can't be hot-loaded.
