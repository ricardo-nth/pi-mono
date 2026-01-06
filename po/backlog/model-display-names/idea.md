---
title: Model Display Names & Aliases
area: model-selector
implementation: hybrid
effort: medium
impact: high
risk: low
status: idea
files:
  - packages/coding-agent/src/modes/interactive/components/model-selector.ts
  - packages/coding-agent/src/core/settings-manager.ts
extensionApi: ctx.ui.setFooter() for footer display only
created: 2026-01-06
---

# Model Display Names & Aliases

Show friendly display names instead of raw model IDs in the footer and model selector.

## Problem

The footer currently shows raw model IDs like `claude-sonnet-4-5-20250929` which:
- Looks cluttered with dates and dashes
- Isn't as readable as it could be
- Takes up unnecessary space

## Proposed Solution

Use the existing `name` field from models, or allow custom aliases in settings.

### Option 1: Use existing `name` field

Models already have a `name` property (e.g., `"GPT-5.2"` for `gpt-5.2`). Show this in the footer instead of the ID.

### Option 2: Custom aliases in settings

```json
{
  "modelAliases": {
    "claude-sonnet-4-5-20250929": "Sonnet 4.5 (Latest)",
    "gpt-5.2": "GPT-5.2",
    "gemini-2.5-pro": "Gemini 2.5 Pro"
  }
}
```

### Option 3: Hybrid

Use `name` by default, allow override via `modelAliases`.

## Display Examples

**Before (footer):**
```
claude-sonnet-4-5-20250929 | minimal | $0.42
```

**After (footer):**
```
Sonnet 4.5 (Latest) | minimal | $0.42
```

## Implementation

1. In footer component, resolve display name: `alias ?? model.name ?? model.id`
2. Add `modelAliases` to settings schema
3. Optionally update model selector to show both name and ID

## "(latest)" Badge Logic

Models come in two forms:
- **Alias**: `claude-opus-4-5` - auto-updates to newest version
- **Dated**: `claude-opus-4-5-20251101` - locked to specific release

Display logic:

| Model ID | Display Name | Why |
|----------|--------------|-----|
| `claude-opus-4-5` | Claude Opus 4.5 (latest) | Alias = auto-updating |
| `claude-opus-4-5-20251101` | Claude Opus 4.5 | Specific version |
| `claude-sonnet-4-5` | Claude Sonnet 4.5 (latest) | Alias |
| `claude-sonnet-4-5-20250929` | Claude Sonnet 4.5 | Specific version |

**Detection**: If model ID has no date suffix AND a dated version exists, it's the alias → show "(latest)".

## Notes

- Models already have proper capitalization in `name` field
- "(latest)" means "auto-updating alias", not "newest specific version"
- Keep ID available somewhere for debugging/reference
