# Pi Mono - Custom Fork

This is a personal fork of [badlogic/pi-mono](https://github.com/badlogic/pi-mono) with custom UI improvements.

## Quick Reference

| Command | Description |
|---------|-------------|
| `po` | Run your custom Pi build |
| `pi` | Run official npm version (if installed) |
| `npm run build` | Rebuild after changes |
| `npm run dev` | Watch mode for development |

## Custom Changes

### Model Selector Improvements
- **Grouped by provider** - Models organized under provider headers (Anthropic, OpenAI, etc.)
- **Hidden model filters** - Configure in `~/.pi/agent/settings.json`
- **Cleaner display** - No `[provider]` badges, spacing between groups

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

## Development Workflow

### Building
```bash
cd packages/coding-agent
npm run build
# The `po` command automatically uses the new build
```

### Testing Changes
```bash
# Run your custom build
po

# Compare with official version
pi
```

## Syncing with Upstream

When you see "Update available" or want to pull Mario's latest changes:

```bash
# 1. Fetch upstream changes
git fetch upstream

# 2. Check what's new (optional)
git log HEAD..upstream/main --oneline

# 3. Merge upstream into your branch
git merge upstream/main

# 4. Resolve conflicts if any (your UI changes are in):
#    - packages/coding-agent/src/modes/interactive/components/model-selector.ts
#    - packages/coding-agent/src/core/settings-manager.ts

# 5. Rebuild
npm install
npm run build

# 6. Test
po

# 7. Push to your fork
git push origin main
```

### If Merge Conflicts Occur

Your custom files (keep your versions):
- `model-selector.ts` - grouped display, filtering
- `settings-manager.ts` - modelFilters settings

## Setup (One-Time)

### 1. Fork on GitHub
Go to https://github.com/badlogic/pi-mono → Fork

### 2. Clone and Configure Remotes
```bash
git clone https://github.com/YOUR_USERNAME/pi-mono.git
cd pi-mono
git remote add upstream https://github.com/badlogic/pi-mono.git
```

### 3. Install Dependencies
```bash
npm install
npm run build
```

### 4. Set Up `po` Command
```bash
# Add to ~/.zshrc or ~/.bashrc:
alias po='node /Users/admin/Documents/Projects/Archive/Contributions/pi-mono/packages/coding-agent/dist/cli.js'

# Reload shell
source ~/.zshrc
```

## File Locations

| File | Purpose |
|------|---------|
| `packages/coding-agent/src/modes/interactive/components/model-selector.ts` | Model selector UI |
| `packages/coding-agent/src/core/settings-manager.ts` | Settings including modelFilters |
| `~/.pi/agent/settings.json` | User settings (model filters, theme, etc.) |

## Future UI Ideas

- [ ] Collapsible provider sections
- [ ] Favorite models pinned to top
- [ ] Model cost/speed indicators
- [ ] Quick switch between recent models
- [ ] Custom model aliases
