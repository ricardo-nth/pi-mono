---
name: Improve Ctrl+C to Clear Work
description: Enhance Ctrl+C behavior to not just clear the input text, but also "clear the work" (e.g., reset pending tool outputs or recently added context) without starting a completely new session like /new does.
implementation: core
priority: medium
---

# Improve Ctrl+C to Clear Work

Currently, `Ctrl+C` only clears the text in the input editor. If a user has "work" in progress (like a long prompt or accumulated context they want to drop while staying in the same session), `Ctrl+C` should handle that more gracefully.

## Goals
- Make `Ctrl+C` feel more like a shell's "abort current line/work" feature.
- Differentiate it from `/new` which wipes the entire history.
- Ensure it clears any pending state in the `InteractiveMode` that might affect the next prompt.
