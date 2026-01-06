---
name: save-idea
description: Save an idea to the PO backlog for later. Creates a folder in po/backlog/ with idea.md front matter.
allowed-tools: AskUserQuestion, Write, Bash
---

# Save Idea to Backlog

Capture an idea for the PO fork's UI improvements.

## Process

1. Ask for idea title (or infer from conversation)
2. Ask for area: footer | model-selector | input | header | global
3. Ask for effort estimate: low | medium | high
4. Ask for impact estimate: low | medium | high
5. Ask for risk level: low | medium | high
6. Get brief description of the idea

## Output

Create folder: `po/backlog/<kebab-case-title>/`

Create `idea.md`:
```yaml
---
title: <Title>
area: <area>
effort: <effort>
impact: <impact>
risk: <risk>
status: idea
files: []
created: <today's date>
---

# <Title>

<Description from user>
```

Confirm creation with path.
