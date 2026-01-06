---
title: Model Change Cache Warning
area: model-selector
implementation: core
effort: medium
impact: medium
risk: medium
status: idea
files:
  - packages/coding-agent/src/modes/interactive/components/model-selector.ts
  - packages/coding-agent/src/modes/interactive/interactive-mode.ts
extensionApi: null
created: 2025-01-06
---

# Model Change Cache Warning

Warn user when changing models will invalidate cache.

## Use Case

- Switching providers (Anthropic → OpenAI) invalidates cache
- Even same provider different model may invalidate
- User should know they're "losing" cached tokens

## Proposed Behavior

When selecting a different model:
```
Switching to gpt-4o will invalidate 45,123 cached tokens.
Continue? [Y/n]
```

Or simpler, just show what's being left behind:
```
Cache used: 45,123 tokens
Switching to gpt-4o...
```

## Implementation

1. Track current cached token count
2. On model change, check if cache will be invalidated
3. Display warning/info before switching

## Notes

- Need to understand when cache is actually invalidated
- Same provider might preserve cache (need to verify)
- Don't make it annoying - maybe just informational, not blocking
