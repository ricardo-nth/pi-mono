# Pi Mono - Custom Fork

Personal fork of [badlogic/pi-mono](https://github.com/badlogic/pi-mono) with opinionated UI tweaks.

**Fork:** https://github.com/ricardo-nth/pi-mono
**Upstream:** https://github.com/badlogic/pi-mono

## What This Is (And Isn't)

This is **not** an improvement. It's just how I like things to look.

I'm not a UI designer. These are personal preferences - opinionated layouts that suit my workflow. Mario's original UI is perfectly fine; I just have opinions about model selectors and spacing. You know how it is.

**The rules:**
- No touching the actual agent logic, system prompts, or core functionality
- UI/layout changes only - shuffling pixels around
- Supporting code (settings, types) may be adjusted *if needed* for UI work
- When in doubt, it's a visual thing, not a functional thing

When syncing upstream, Mario's functional improvements flow in. Our changes are just cosmetic layers on top - lipstick on a very capable pig.

---

## Monorepo Structure

This is a monorepo with multiple packages. The `coding-agent` is what we use, but it depends on several other packages.

### Package Overview

| Package | npm Name | Description | Needed for `po`? |
|---------|----------|-------------|------------------|
| **coding-agent** | `@mariozechner/pi-coding-agent` | CLI coding agent (like Claude Code, Codex) | **Yes** - this IS `po` |
| **agent** | `@mariozechner/pi-agent-core` | Core agent abstraction, state management, transports | **Yes** - dependency |
| **ai** | `@mariozechner/pi-ai` | Unified LLM API, model discovery, provider configs | **Yes** - dependency |
| **tui** | `@mariozechner/pi-tui` | Terminal UI library with differential rendering | **Yes** - dependency |
| **web-ui** | `@mariozechner/pi-web-ui` | Web UI components for chat interfaces | No |
| **mom** | `@mariozechner/pi-mom` | Slack bot that delegates to pi agent | No |
| **pods** | `@mariozechner/pi` | CLI for vLLM deployments on GPU pods | No |

### Dependency Graph

```
coding-agent (po command)
    ├── pi-agent-core   (agent logic, tools, state)
    ├── pi-ai           (LLM providers, model registry)
    └── pi-tui          (terminal rendering)
```

### Other Interesting Packages

**MOM (`packages/mom`)** - Slack bot integration. Could be interesting for running pi as a Slack assistant.

**Web UI (`packages/web-ui`)** - Reusable chat components. Could build a web version of pi with this.

**Pods (`packages/pods`)** - For self-hosting LLMs on GPU pods. Advanced infrastructure stuff.

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `po` | Your custom Pi build |
| `pi` | Official npm version |
| `npm run build` | Rebuild all packages |
| `cd packages/coding-agent && npm run build` | Rebuild just coding-agent |

---

## What's Been Fiddled With

### Model Selector (the thing that bugged me most)
- **Grouped by provider** - Because scrolling through 93 flat items was giving me anxiety
- **Hidden model filters** - I don't need to see Claude 3 Haiku from 2024, thanks
- **Removed `[provider]` badges** - If it's under "Anthropic", I know it's Anthropic

### Settings: `~/.pi/agent/settings.json`
```json
{
  "modelFilters": {
    "hidden": [
      "claude-3-*",
      "claude-3.5-*",
      "claude-3.7-*",
      "claude-opus-4-*",
      "claude-*-2024*",
      "grok-*-preview"
    ],
    "hiddenProviders": []
  }
}
```

---

## Development Workflow

### Building After Changes
```bash
# Full rebuild (if you changed dependencies)
npm run build

# Just coding-agent (faster, for UI changes)
cd packages/coding-agent && npm run build
```

### Testing
```bash
po          # Your build
pi          # Official (for comparison)
```

---

## Syncing with Upstream

When pi shows "Update available" or you want Mario's latest:

```bash
# 1. Fetch upstream
git fetch upstream

# 2. See what's new
git log HEAD..upstream/main --oneline

# 3. Merge
git merge upstream/main

# 4. Resolve conflicts (your UI files):
#    - packages/coding-agent/src/modes/interactive/components/model-selector.ts
#    - packages/coding-agent/src/core/settings-manager.ts

# 5. Rebuild & test
npm install && npm run build
po

# 6. Push to your fork
git push origin main
```

---

## File Locations

### Your Modified Files (UI only)
| File | Changes |
|------|---------|
| `packages/coding-agent/src/modes/interactive/components/model-selector.ts` | Grouped display, filtering |
| `packages/coding-agent/src/core/settings-manager.ts` | modelFilters settings |

### User Config
| File | Purpose |
|------|---------|
| `~/.pi/agent/settings.json` | Model filters, theme, defaults |
| `~/.local/bin/po` | Your custom command script |

### Key Directories for UI Work
| Directory | What's There |
|-----------|--------------|
| `packages/coding-agent/src/modes/interactive/components/` | All TUI components |
| `packages/coding-agent/src/modes/interactive/theme/` | Theme JSON files |
| `packages/tui/src/components/` | Base TUI primitives (Text, Input, etc.) |

---

## PO Project Structure

All custom work is organized in [`/po`](./po/README.md):

```
po/
├── backlog/     # Ideas waiting to be worked on
├── active/      # Currently in progress
└── done/        # Completed features
```

Each feature is a folder with `idea.md` (front matter + description) and optional `assets/`.

### Skills

| Skill | What it does |
|-------|--------------|
| `/save-idea` | Capture an idea to backlog |
| `/backlog` | List ideas with computed priorities |
| `/start-feature` | Promote idea to active, generate PRD |
| `/park` | Move active feature back to backlog |

---

## Setup Reference (Already Done)

### Remotes
```
origin   → https://github.com/ricardo-nth/pi-mono.git
upstream → https://github.com/badlogic/pi-mono.git
```

### po Command
Script at `~/.local/bin/po` runs the local build.
