---
title: Nerd Font Folder Icons
category: footer
type: ui-only
complexity: low
files:
  - packages/coding-agent/src/modes/interactive/components/footer.ts
status: idea
---

# Nerd Font Folder Icons

Add nerd font icons to the footer path display, similar to Starship prompt.

## Current
```
coding-agent  ████░░░░ 12%
```

## Proposed
```
󰉋 coding-agent  ████░░░░ 12%
```

Or with path truncation indicator:
```
 packages/coding-agent  ████░░░░ 12%
```

## Icons Reference

```
Folders:  󰉋 (generic)   (alt)  󰈙 (documents)  󰲋 (projects)
Truncation:  (indicates more folders before)
```

## Implementation

In `footer.ts`, update `truncatePath()` to optionally include icons:

```typescript
const ICONS = {
  folder: "󰉋",
  truncated: "",  // shows "more folders before this"
};
```

## Notes

- Current clean look without icons is "more professional, adult"
- Icons are optional enhancement, not priority
- Depends on user having nerd fonts installed
