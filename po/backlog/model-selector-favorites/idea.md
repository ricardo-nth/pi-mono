---
title: Favorite Models
area: model-selector
implementation: core
effort: medium
impact: high
risk: low
status: idea
files:
  - packages/coding-agent/src/modes/interactive/components/model-selector.ts
  - packages/coding-agent/src/core/settings-manager.ts
extensionApi: null
created: 2025-01-06
---

# Favorite Models

Pin frequently used models to top of selector.

## Proposed Setting

```json
{
  "favoriteModels": [
    "claude-sonnet-4-5-20250929",
    "gpt-4o",
    "gemini-2.5-pro"
  ]
}
```

## Display

```
★ Favorites
  → claude-sonnet-4-5
    gpt-4o
    gemini-2.5-pro

anthropic
  claude-opus-4-5
  ...
```

## Implementation

1. Add `favoriteModels` to Settings
2. In model selector, extract favorites from filtered list
3. Render favorites section at top
4. Add keybinding to toggle favorite (e.g., `f` key)

## Notes

- With good filtering, this may not be needed
- But could be nice for quick access to 3-4 go-to models
