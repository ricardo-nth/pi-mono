---
title: Cache Stats Display
category: footer
type: functional
complexity: medium
files:
  - packages/coding-agent/src/modes/interactive/components/footer.ts
  - packages/coding-agent/src/core/settings-manager.ts
status: idea
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
- Consider showing only on session close instead (see session-close-summary.md)
- Low priority for always-visible display
- R = cache read, W = cache write
