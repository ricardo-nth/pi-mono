---
name: start-feature
description: Start working on a backlog feature. Moves to active/, runs interview if needed, generates PRD.
allowed-tools: AskUserQuestion, Read, Write, Edit, Bash, Glob
---

# Start Feature

Promote a backlog idea to active development.

## Process

1. If no feature specified, list backlog and ask which one
2. Move folder from `po/backlog/<feature>/` to `po/active/<feature>/`
3. Update idea.md status to "active"
4. Ask: "Need to clarify requirements?"
   - If yes: invoke /interview concepts
   - If no: proceed
5. Invoke /prd skill to generate prd.json in the feature folder
6. Confirm ready for /ralph-loop

## Moving Folders

```bash
mv po/backlog/<feature> po/active/
```

## Output

Confirm feature is now active and PRD is ready.
Suggest: "Run /ralph-loop to begin implementation"
