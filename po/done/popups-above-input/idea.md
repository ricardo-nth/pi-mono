---
title: Popups Above Input
area: input
implementation: core
effort: low
impact: high
risk: low
status: done
files:
  - packages/tui/src/components/editor.ts
extensionApi: null
created: 2026-01-06
---

# Popups Above Input

Change autocomplete and slash command menus to appear above the input area instead of below.

**Priority: HIGH** - This is the main task blocking other UI improvements.

## Primary Triggers

| Trigger | What Opens | Priority |
|---------|------------|----------|
| `/` | Slash commands menu | HIGH |
| `@` | File/context mentions | HIGH |
| Tab | Autocomplete | Medium |

## Problem

When opening `/` or `@` menus, they appear below the input/footer, pushing content up. This causes visual jank and makes the footer/input jump around.

## Solution

Render autocomplete lists above the editor content instead of below. This is a localized change in `editor.ts`.

## Current Code (editor.ts:384-391)

```typescript
// Render bottom border
result.push(horizontal.repeat(width));

// Add autocomplete list if active - ALWAYS BELOW
if (this.isAutocompleting && this.autocompleteList) {
  result.push(...this.autocompleteList.render(width));
}
```

## Proposed Change

```typescript
// Add autocomplete list ABOVE the editor
if (this.isAutocompleting && this.autocompleteList) {
  const autocompleteLines = this.autocompleteList.render(width);
  result.unshift(...autocompleteLines);
}

// Render bottom border
result.push(horizontal.repeat(width));
```

Or with a configurable option:

```typescript
// Could add to EditorTheme or constructor options
autocompletePosition: 'above' | 'below' = 'above';
```

## Visual Result

### Before (current)
```
│  > /comm                        │
└─────────────────────────────────┘
  /commit      Create a commit
  /compact     Manually compact
  /copy        Copy last message
Footer stays here, menu below
```

### After (proposed)
```
  /commit      Create a commit
  /compact     Manually compact
  /copy        Copy last message
│  > /comm                        │
└─────────────────────────────────┘
Footer stays here, menu above
```

## Why This Works

- Footer and input don't need to move
- No TUI framework changes needed
- Single file, localized change
- Addresses the core visual complaint

## Research Notes

### Original "Sticky Footer" Approach

We explored true sticky footer (TUI framework changes) but determined:
- TUI has no fixed positioning or viewport-relative layout
- Would require significant framework enhancement
- Similar complexity to Ink-based solutions (like Gemini CLI)

### Pragmatic Alternative

This "popups above" approach achieves 80% of the UX benefit with 5% of the effort. The footer/input still flow with content, but popups no longer push them around.

## Why Effort is Low

- Change is ~5 lines in one file
- No architectural changes
- Uses existing rendering, just reorders output
- Low risk of breaking anything

## Foundation For Other Ideas

This is the prerequisite for "sticky footer feel". Once popups render above:
- **hotkeys-popup** - `?` popup appears above input
- **command-palette** - palette appears above input
- **toast-notifications** - toasts appear above input
- **welcome-screen** - cleaner with stable footer

## Notes

- Could be made configurable if users want either behavior
- Paves the way for command palette work
- Much simpler than the original sticky footer plan
- Priority: HIGH - unlocks several other improvements
