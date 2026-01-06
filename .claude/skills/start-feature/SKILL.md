---
name: start-feature
description: Start working on a backlog feature. Moves to active/, runs interview if needed, generates PRD.
allowed-tools: AskUserQuestion, Read, Write, Edit, Bash, Glob
---

# Start Feature

Promote a backlog idea to active development.

## Process

1. If no feature specified, list backlog and ask which one
2. **Read the idea.md** and check `implementation` field
3. **If implementation is `extension`:**
   - Read `knowledge/extensions.md` for relevant API
   - Confirm the extension approach is still valid
   - Note: PRD should include creating extension file in `~/.pi/agent/extensions/`
4. **If implementation is `core`:**
   - Note which files will be modified
   - Warn about potential upstream merge conflicts
5. Move folder from `po/backlog/<feature>/` to `po/active/<feature>/`
6. Update idea.md status to "active"
7. Ask: "Need to clarify requirements?"
   - If yes: invoke /interview concepts
   - If no: proceed
8. Invoke /prd skill to generate prd.json in the feature folder
   - For extensions: include extension file creation as first feature
   - For core: include file modification targets
9. Confirm ready for /ralph-loop

## Extension vs Core Guidance

**Extension PRD features should include:**
- Create extension file: `~/.pi/agent/extensions/<name>.ts`
- Register command/hook/tool
- Test via `po --extension <path>` first
- Document usage

**Core PRD features should include:**
- Identify target files
- Check for upstream conflicts
- Include rebuild step: `cd packages/coding-agent && npm run build`

## Moving Folders

```bash
mv po/backlog/<feature> po/active/
```

## Output

Confirm:
- Feature is now active
- Implementation approach (extension/core)
- PRD is ready

Suggest: "Run /ralph-loop to begin implementation"
