---
title: Command Palette
area: global
implementation: extension
effort: medium
impact: high
risk: low
status: idea
files: []
extensionApi: ctx.ui.custom(), registerCommand()
created: 2026-01-06
---

# Command Palette

Replace inline slash command menus with a proper command palette popup, similar to Neovim's Telescope or VS Code's command palette.

## Levels of Implementation

### Level 1: Full-Screen Palette (Achievable Now)
- Use `ctx.ui.custom()` to show a searchable command list
- Replaces editor area temporarily (like model selector does)
- Fuzzy search through commands
- Keyboard navigation (arrows, Enter, Escape)

### Level 2: Enhanced Palette
- Group commands by category (built-in, extension, templates)
- Show command descriptions
- Recent commands / favorites
- Integrated hotkeys view (`?` to show shortcuts)

### Level 3: True Floating Palette (Requires TUI Work)
- Centered modal that floats over content
- Requires sticky footer work first
- More polished UX

## Visual Concept (Level 1 - Full Screen)

```
┌─────────────────────────────────┐
│  Command Palette                │
│  > /                            │
│  ─────────────────────────────  │
│  /commit      Create a commit   │
│  /plan        Enter plan mode   │
│  /model       Select model      │
│  /settings    Open settings     │
│  ─────────────────────────────  │
│  [↑↓] Navigate  [Enter] Select  │
│  [Esc] Close    [?] Hotkeys     │
└─────────────────────────────────┘
```

## Hotkeys Sub-palette

```
┌─────────────────────────────────┐
│  Keyboard Shortcuts             │
│  [Navigation] [Editing] [Other] │
│  ─────────────────────────────  │
│  Ctrl+C    Cancel current       │
│  Ctrl+L    Clear screen         │
│  Ctrl+K    Kill to end of line  │
│  ...                            │
│  ─────────────────────────────  │
│  [ESC] Back  [TAB] Switch tab   │
└─────────────────────────────────┘
```

## Research Notes (2026-01-06)

### How `ctx.ui.custom()` Works

This is the key API for building the command palette:

```typescript
const result = await ctx.ui.custom<string>((tui, theme, done) => {
  // Create your component
  // Handle keyboard input
  // Call done(value) when finished
  return myComponent;
});
```

It **replaces the editor container** temporarily - same pattern used by:
- Model selector (`showModelSelector()`)
- Tree selector (`showTreeSelector()`)
- Session selector (`showSessionSelector()`)

### Existing Patterns to Reuse

| Component | What it does | Reusable for palette? |
|-----------|--------------|----------------------|
| `SelectList` | Searchable dropdown with arrow nav | Yes - core list |
| `ModelSelectorComponent` | Grouped, filterable list | Yes - grouping logic |
| `showSelector()` pattern | Focus management, cleanup | Yes - wrapper |

### Command Registration

Commands come from three sources:
1. **Built-in**: Hardcoded in `interactive-mode.ts:195-211`
2. **Extensions**: `session.extensionRunner.getRegisteredCommands()`
3. **Templates**: `session.promptTemplates`

All already available to gather into palette.

### Why Effort Reduced

- Original estimate: high
- Revised estimate: **medium**
- Reason: `ctx.ui.custom()` + existing `SelectList` + `showSelector()` pattern
- Can build incrementally, Level 1 is straightforward

## Implementation Plan

1. Create `PaletteComponent` extending existing patterns
2. Add keyboard shortcut trigger (e.g., Ctrl+P or Ctrl+Shift+P)
3. Gather commands from all sources
4. Reuse `SelectList` for fuzzy search
5. Add grouping and descriptions

## Dependencies

- None for Level 1 (full-screen)
- Sticky footer for Level 3 (floating)

## Inspiration

- Neovim Telescope plugin
- VS Code command palette (Ctrl+Shift+P)
- Raycast / Alfred
- mitsuhiko's answer.ts extension (QnA component pattern)
