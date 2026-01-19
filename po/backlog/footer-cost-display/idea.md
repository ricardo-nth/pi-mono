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

## Updated Approach (2026-01-08)

With the custom `powerline-footer.ts` extension in place, we can:
1. Add cost display as an optional line in the footer extension
2. Toggle via `/footer cost` command (similar to example extensions)
3. Keep main footer layout, just add/remove the cost line

This is simpler than modifying core footer - just extend the existing extension.

## Status (2026-01-09) - Ready to Implement

The `ctx.ui.setFooter()` API (available since v0.37.3) is confirmed working - we're already using it in `powerline-footer.ts`. This feature is ready whenever we want it:

1. Add cost tracking to footer extension state
2. Calculate from session token usage
3. Format as `$X.XXX` in footer line
4. Toggle with command or setting

**No blockers** - just needs implementation time.
