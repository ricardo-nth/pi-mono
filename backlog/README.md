# Backlog

Ideas and potential changes for this fork. Each file represents one idea with front matter for categorisation.

## Front Matter Schema

```yaml
---
title: Short descriptive title
category: footer | model-selector | session | settings | general
type: ui-only | functional
complexity: low | medium | high
files:
  - path/to/file.ts
  - path/to/another.ts
status: idea | planned | in-progress | done
---
```

## Quick Reference

| File | Category | Type | Complexity |
|------|----------|------|------------|
| [footer-nerd-icons.md](./footer-nerd-icons.md) | footer | ui-only | low |
| [footer-cache-stats.md](./footer-cache-stats.md) | footer | functional | medium |
| [footer-cost-display.md](./footer-cost-display.md) | footer | functional | medium |
| [session-close-summary.md](./session-close-summary.md) | session | functional | high |
| [model-change-cache-warning.md](./model-change-cache-warning.md) | model-selector | functional | medium |
| [model-selector-collapsible.md](./model-selector-collapsible.md) | model-selector | ui-only | medium |
| [model-selector-favorites.md](./model-selector-favorites.md) | model-selector | ui-only | medium |

## By Category

### Footer
- Nerd font icons (ui-only, low)
- Cache stats toggle (functional, medium)
- Cost display toggle (functional, medium)

### Model Selector
- Collapsible provider sections (ui-only, medium)
- Favorite models (ui-only, medium)
- Model change cache warning (functional, medium)

### Session
- Close summary with resume command (functional, high)

## By Complexity

**Low** - Quick wins, minimal code changes
- Footer nerd icons

**Medium** - Some logic changes, testing needed
- Cache stats, cost display, collapsible sections, favorites

**High** - Significant changes, careful testing required
- Session close experience
