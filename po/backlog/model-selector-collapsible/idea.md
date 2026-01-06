---
title: Collapsible Provider Sections
area: model-selector
implementation: core
effort: medium
impact: medium
risk: low
status: idea
files:
  - packages/coding-agent/src/modes/interactive/components/model-selector.ts
extensionApi: null
created: 2025-01-06
---

# Collapsible Provider Sections

Allow collapsing/expanding provider groups in model selector.

## Current

All providers expanded, scroll through everything.

## Proposed

```
▼ anthropic
  → claude-sonnet-4-5
    claude-opus-4-5
► openai (collapsed)
► google (collapsed)
```

## Keybindings

- Left arrow or `-`: collapse current provider
- Right arrow or `+`: expand provider
- Or: dedicated key to toggle

## Implementation

1. Add `collapsed: boolean` state per provider group
2. Skip rendering models for collapsed groups
3. Handle navigation to skip collapsed sections
4. Persist collapse state? (probably not needed)

## Notes

- Medium complexity due to navigation changes
- Would make long provider lists more manageable
- Nice-to-have, not essential with filtering
