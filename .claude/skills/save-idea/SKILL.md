---
name: save-idea
description: Save an idea to the PO backlog for later. Creates a folder in po/backlog/ with idea.md front matter.
allowed-tools: AskUserQuestion, Write, Bash, Read
---

# Save Idea to Backlog

Capture an idea for the PO fork's UI improvements.

## Before Starting

**Read `knowledge/extensions.md`** to understand what can be done via extension vs core changes.

## Process

1. Ask for idea title (or infer from conversation)
2. Ask for area: footer | model-selector | input | header | global
3. **Check extension compatibility:**
   - Read `knowledge/extensions.md`
   - If area is `footer` → likely extension-capable
   - If area is `model-selector` or `input` → likely core change
   - Ask user to confirm implementation approach
4. Ask for implementation: extension | core | hybrid
5. Ask for effort estimate: low | medium | high
6. Ask for impact estimate: low | medium | high
7. Ask for risk level: low | medium | high
8. Get brief description of the idea

## Extension Check Logic

| Area | Default Implementation | Extension API |
|------|----------------------|---------------|
| footer | extension | `ctx.ui.setFooter()` |
| header | extension | `ctx.ui.setStatus()`, `ctx.ui.setWidget()` |
| global | depends | Various hooks |
| model-selector | core | No hook exists |
| input | core | No hook exists |

## Output

Create folder: `po/backlog/<kebab-case-title>/`

Create `idea.md`:
```yaml
---
title: <Title>
area: <area>
implementation: <extension | core | hybrid>
effort: <effort>
impact: <impact>
risk: <risk>
status: idea
files: []
extensionApi: <relevant API if extension, empty if core>
created: <today's date>
---

# <Title>

<Description from user>

## Implementation Notes

<If extension: which API to use, reference example>
<If core: which files to modify>
```

Confirm creation with path and implementation approach.
