# PO Project Structure

Custom UI work for the Pi fork.

## Stages

| Folder | Purpose |
|--------|---------|
| `backlog/` | Ideas waiting to be worked on |
| `active/` | Currently in progress |
| `done/` | Completed features (archive) |

## Workflow

1. Create folder in `backlog/` with `idea.md`
2. When ready, move to `active/` and generate PRD
3. Implement via `/ralph-loop`
4. Move to `done/` when complete

## idea.md Front Matter

```yaml
---
title: Feature Name
area: footer | model-selector | input | header | global
implementation: extension | core | hybrid
effort: low | medium | high
impact: low | medium | high
risk: low | medium | high
status: idea | ready | active | done
files: []
extensionApi: ctx.ui.setFooter() | null | etc.
created: YYYY-MM-DD
---
```

### Implementation Types

| Type | Meaning | Merge Risk |
|------|---------|------------|
| `extension` | Use Pi extension API only | None |
| `core` | Must modify source files | High |
| `hybrid` | Some extension, some core | Medium |

See `knowledge/extensions.md` for available extension APIs.

## Skills

- `/save-idea` - Save idea to backlog
- `/backlog` - List backlog with priorities
- `/start-feature` - Promote to active, generate PRD
- `/park` - Move back to backlog
