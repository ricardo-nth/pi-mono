---
title: Color Themes
area: global
implementation: hybrid
effort: high
impact: high
risk: low
status: idea
files:
  - packages/coding-agent/src/modes/interactive/theme/
  - packages/tui/src/
extensionApi: unknown - needs research on theme loading API
created: 2026-01-06
---

# Color Themes

Support popular color schemes like Catppuccin, Tokyo Night, Dracula, etc.

## Current State

Pi has a theme system with JSON theme files in:
`packages/coding-agent/src/modes/interactive/theme/`

Need to investigate how extensible this is for full color schemes.

## Goals

### Built-in Themes
- Catppuccin (Mocha, Macchiato, Frappe, Latte)
- Tokyo Night (Night, Storm, Day)
- Dracula
- Gruvbox (Dark, Light)
- Nord
- One Dark
- Solarized (Dark, Light)

### User Custom Themes
- Load from `~/.pi/agent/themes/` directory
- JSON format matching internal theme structure
- Easy to create and share

## Theme Structure (Proposed)

```json
{
  "name": "Catppuccin Mocha",
  "colors": {
    "background": "#1e1e2e",
    "foreground": "#cdd6f4",
    "accent": "#89b4fa",
    "error": "#f38ba8",
    "warning": "#fab387",
    "success": "#a6e3a1",
    "muted": "#6c7086",
    "border": "#313244"
  },
  "syntax": {
    "keyword": "#cba6f7",
    "string": "#a6e3a1",
    "number": "#fab387",
    "comment": "#6c7086"
  }
}
```

## Configuration

In `~/.pi/agent/settings.json`:

```json
{
  "theme": "catppuccin-mocha"
}
```

Or for custom:

```json
{
  "theme": "~/.pi/agent/themes/my-theme.json"
}
```

## Implementation Notes

- Check if TUI framework supports full 24-bit color
- May need fallback for terminals with limited color support
- Should detect terminal capabilities

## Inspiration

- iTerm2 color schemes
- Alacritty themes
- Neovim colorschemes
