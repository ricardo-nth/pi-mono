---
title: Toast Notifications
area: header
implementation: extension
effort: medium
impact: medium
risk: low
status: idea
files: []
extensionApi: ctx.ui.custom({ overlay: true })
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

## Status Update (2026-01-09) - Unblocked!

### Widgets Didn't Work Out

We tried `ctx.ui.setWidget()` but it wasn't suitable:
- Renders above the editor, not floating
- Disrupts layout flow
- Not visually what we wanted

### Overlay Support Now Available (v0.42.0)

The TUI now has proper overlay compositing via `ctx.ui.custom({ overlay: true })`:

```typescript
// Show a floating toast
await ctx.ui.custom<void>(
  (tui, theme, kb, done) => new ToastComponent(theme, done),
  { overlay: true }  // composites over existing content!
);
```

The overlay system:
- Maintains an `overlayStack` for multiple overlays
- Uses `compositeLineAt()` to splice overlay content into base lines
- Preserves ANSI styling across overlay boundaries
- See `examples/extensions/overlay-test.ts` for working example

### What's Now Possible

- True floating toasts in any corner
- Multiple stacked notifications
- Auto-dismiss with timers
- Proper z-ordering

### Implementation Approach

1. Create `ToastComponent` with fixed width/height
2. Position in top-right using overlay options
3. Use `setTimeout` to call `done()` for auto-dismiss
4. Stack multiple toasts with offset positioning

**Risk reduced from medium to low** - proven pattern from overlay-test example.
