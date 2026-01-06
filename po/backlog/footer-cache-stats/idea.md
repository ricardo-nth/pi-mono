---
title: Cache Stats Display
area: footer
effort: medium
impact: low
risk: medium
status: idea
files:
  - packages/coding-agent/src/modes/interactive/components/footer.ts
  - packages/coding-agent/src/core/settings-manager.ts
created: 2025-01-06
---

# Cache Stats Display

Optional display of cache read/write tokens in footer.

## Use Case

- Debugging cache issues (e.g., OAuth provider not caching properly)
- Understanding token burn rate
- Seeing cache efficiency

## Proposed Setting

```json
{
  "footer": {
    "showCacheStats": false
  }
}
```

## Display Format

When enabled:
```
coding-agent  R3.8k W17k  ████░░░░ 12%
```

## Implementation

1. Add `footer.showCacheStats` to Settings interface
2. Add getter in SettingsManager
3. Conditionally render in footer.ts

## Notes

- Cache stats most useful at session close, not during use
- Consider showing only on session close instead (see session-close-summary)
- Low priority for always-visible display
- R = cache read, W = cache write
