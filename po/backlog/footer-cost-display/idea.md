---
title: Cost Display Toggle
area: footer
implementation: extension
effort: low
impact: low
risk: low
status: idea
files: []
extensionApi: ctx.ui.setFooter()
created: 2025-01-06
---

# Cost Display Toggle

Optional cost display in footer.

## Proposed Setting

```json
{
  "footer": {
    "showCost": false
  }
}
```

## Display Format

When enabled:
```
coding-agent  $0.074  ████░░░░ 12%
```

## Dependencies

- Requires model pricing data
- Current: pricing may come from provider settings or API
- Need to verify where cost calculation happens

## Notes

- Cost is already calculated in current footer (we removed it)
- This just adds a setting to toggle visibility
- Low priority - session close summary is better place for cost
