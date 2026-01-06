# Pi Extension API Reference

Reference for determining whether UI work can be done via extension vs core changes.

## Extension Installation

Extensions load via:
- `--extension` flag: `pi --extension path/to/extension.ts`
- Auto-discovery: `~/.pi/agent/extensions/` or `.pi/extensions/`

## Available UI APIs

### Footer Customization
```typescript
ctx.ui.setFooter((tui, theme) => ({
  render(width: number): string[] {
    // Return array of lines to render
    return [truncateToWidth(content, width)];
  },
  invalidate() {}
}));
```
**Use for:** Custom footer content, token stats, cost display, cache metrics

### Status Line
```typescript
ctx.ui.setStatus("unique-id", theme.fg("accent", "● ") + theme.fg("dim", "Status text"));
```
**Use for:** Persistent status indicators, turn counters, progress indicators

### Notifications (Inline)
```typescript
ctx.ui.notify("Message text", "info" | "warning" | "error");
```
**Note:** NOT a toast - adds inline message to chat area

### Widgets (Above Editor)
```typescript
ctx.ui.setWidget("widget-id", ["Line 1", "Line 2"]);
ctx.ui.setWidget("widget-id", undefined); // Remove
```
**Use for:** Persistent info panels, basic notification areas

### Custom Full-Screen Components
```typescript
const result = await ctx.ui.custom<T>((tui, theme, done) => {
  // Create component
  // Handle input
  // Call done(value) when finished
  return myComponent;
});
```
**Use for:** Command palettes, custom selectors, splash screens

### Confirmations & Selections
```typescript
const confirmed = await ctx.ui.confirm("Question?");
const choice = await ctx.ui.select("Pick one:", ["A", "B", "C"]);
```
**Use for:** Interactive prompts, user choices

## Lifecycle Hooks

| Hook | When | Use For |
|------|------|---------|
| `session_start` | Session begins | Welcome screens, initialization |
| `session_end` | Session ends | Summary screens, cleanup |
| `session_switch` | Session changes | Reset state |
| `turn_start` | Before LLM response | Status updates |
| `turn_end` | After LLM response | Status updates |
| `tool_call` | Tool invoked | Intercept/modify/block tools |
| `before_agent_start` | Before agent runs | Modify system prompt |

## Extension Compatibility Matrix

### Can Do via Extension (Recommended)

| Feature | API | Complexity |
|---------|-----|------------|
| Custom footer content | `setFooter()` | Low |
| Token/cost display | `setFooter()` | Low |
| Cache stats | `setFooter()` | Low |
| Nerd font icons (footer) | `setFooter()` | Low |
| Status indicators | `setStatus()` | Low |
| Welcome screen | `session_start` + `custom()` | Medium |
| Session close summary | `session_end` hook | Medium |
| Command palette | `custom()` + `registerCommand()` | Medium |
| Plan mode | Hooks + `registerCommand()` | Medium |
| Custom tools | `registerTool()` | Medium |
| System prompt mods | `before_agent_start` | Low |

### Cannot Do via Extension (Core Changes Required)

| Feature | Why | Where |
|---------|-----|-------|
| Model selector changes | No hook for selector component | `model-selector.ts` |
| Popups above input | Editor component internal | `editor.ts` |
| True floating toasts | TUI lacks z-index/layers | `tui.ts` |
| Theme system changes | Theme loaded before extensions | `theme/` |
| Input behavior changes | Editor internals | `editor.ts` |

### Unclear / Needs Research

| Feature | Notes |
|---------|-------|
| Color themes | May be able to load via extension if theme API exposed |
| Model change warnings | Might hook `tool_call` for model switch |

## Example Extensions

Located in `packages/coding-agent/examples/extensions/`:

| Extension | Demonstrates |
|-----------|--------------|
| `custom-footer.ts` | Footer with token stats, context % |
| `status-line.ts` | Turn progress indicator |
| `plan-mode.ts` | Read-only mode, tool filtering |
| `question.ts` | Interactive user prompts |
| `pirate.ts` | System prompt modification |
| `welcome-screen.ts` | Session start customization |

## Decision Flow

When planning UI work:

```
Is there an extension hook for this?
├─ Yes → Implement as extension
│        Pro: Survives upstream merges
│        Pro: Shareable
│        Con: None really
│
└─ No → Core change required
         Pro: Full control
         Con: Merge conflicts with upstream
         Con: Maintenance burden
```

## Resources

- Examples: `packages/coding-agent/examples/extensions/`
- API types: `@mariozechner/pi-coding-agent` → `ExtensionAPI`
- Issue #326: Unified extension loading (future direction)
- PR #373: Session preview pane (TUI component example)
