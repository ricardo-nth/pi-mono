# Implementation Plan: Context/Skills/Extensions Viewers

## Summary

Add `/context`, `/skills`, `/extensions` slash commands that open popup viewers (like `/hotkeys`), then remove the startup prints from `initExtensions()`.

## Files to Modify

1. `packages/coding-agent/src/modes/interactive/components/info-viewer.ts` (NEW)
2. `packages/coding-agent/src/modes/interactive/components/index.ts` (export)
3. `packages/coding-agent/src/modes/interactive/interactive-mode.ts` (commands + handlers)

## Step 1: Create InfoViewerComponent

A reusable popup component for displaying lists of items with paths/descriptions.

```typescript
// info-viewer.ts
import { Container, getEditorKeybindings, Spacer, Text } from "@mariozechner/pi-tui";
import { theme } from "../theme/theme.js";
import { DynamicBorder } from "./dynamic-border.js";

interface InfoItem {
  label: string;
  detail?: string;
}

interface InfoViewerConfig {
  title: string;
  subtitle?: string;
  items: InfoItem[];
  emptyMessage?: string;
}

export class InfoViewerComponent extends Container {
  private onCancelCallback: () => void;

  constructor(config: InfoViewerConfig, onCancel: () => void) {
    super();
    this.onCancelCallback = onCancel;

    // Top border
    this.addChild(new DynamicBorder());
    this.addChild(new Spacer(1));

    // Title
    this.addChild(new Text("  " + theme.bold(theme.fg("accent", config.title)), 0, 0));
    if (config.subtitle) {
      this.addChild(new Text("  " + theme.fg("muted", config.subtitle), 0, 0));
    }
    this.addChild(new Spacer(1));

    // Items or empty message
    if (config.items.length === 0) {
      this.addChild(new Text("  " + theme.fg("dim", config.emptyMessage ?? "None"), 0, 0));
    } else {
      for (const item of config.items) {
        const label = theme.fg("accent", item.label);
        const detail = item.detail ? theme.fg("dim", ` ${item.detail}`) : "";
        this.addChild(new Text(`  ${label}${detail}`, 0, 0));
      }
    }

    this.addChild(new Spacer(1));
    this.addChild(new Text("  " + theme.fg("muted", "Press Escape to close"), 0, 0));
    this.addChild(new Spacer(1));
    this.addChild(new DynamicBorder());
  }

  handleInput(keyData: string): void {
    const kb = getEditorKeybindings();
    if (kb.matches(keyData, "selectCancel")) {
      this.onCancelCallback();
    }
  }
}
```

## Step 2: Add Slash Commands

In `interactive-mode.ts` around line 240, add to `slashCommands` array:

```typescript
{ name: "context", description: "Show loaded context files" },
{ name: "skills", description: "Show loaded skills" },
{ name: "extensions", description: "Show loaded extensions" },
```

## Step 3: Add Command Handlers

Around line 1370 (after other slash command handlers):

```typescript
if (text === "/context") {
  this.editor.addToHistory?.(text);
  this.editor.setText("");
  this.showContextViewer();
  return;
}

if (text === "/skills") {
  this.editor.addToHistory?.(text);
  this.editor.setText("");
  this.showSkillsViewer();
  return;
}

if (text === "/extensions") {
  this.editor.addToHistory?.(text);
  this.editor.setText("");
  this.showExtensionsViewer();
  return;
}
```

## Step 4: Add Viewer Methods

```typescript
private showContextViewer(): void {
  const contextFiles = loadProjectContextFiles();
  this.showSelector((done) => {
    const viewer = new InfoViewerComponent(
      {
        title: "Loaded Context",
        subtitle: `${contextFiles.length} file(s)`,
        items: contextFiles.map((f) => ({ label: f.path })),
        emptyMessage: "No context files loaded",
      },
      () => {
        done();
        this.ui.requestRender();
      },
    );
    return { component: viewer, focus: viewer };
  });
}

private showSkillsViewer(): void {
  const skillsSettings = this.session.skillsSettings;
  const { skills } = loadSkills(skillsSettings ?? {});
  this.showSelector((done) => {
    const viewer = new InfoViewerComponent(
      {
        title: "Loaded Skills",
        subtitle: `${skills.length} skill(s)`,
        items: skills.map((s) => ({
          label: s.name,
          detail: s.filePath,
        })),
        emptyMessage: "No skills loaded",
      },
      () => {
        done();
        this.ui.requestRender();
      },
    );
    return { component: viewer, focus: viewer };
  });
}

private showExtensionsViewer(): void {
  const extensionRunner = this.session.extensionRunner;
  const paths = extensionRunner?.getExtensionPaths() ?? [];
  const commands = extensionRunner?.getRegisteredCommands() ?? [];
  
  this.showSelector((done) => {
    const items: InfoItem[] = paths.map((p) => ({ label: p }));
    // Add registered commands as sub-items
    if (commands.length > 0) {
      items.push({ label: "", detail: "" }); // spacer
      items.push({ label: "Commands:", detail: "" });
      for (const cmd of commands) {
        items.push({ label: `  /${cmd.name}`, detail: cmd.description });
      }
    }
    
    const viewer = new InfoViewerComponent(
      {
        title: "Loaded Extensions",
        subtitle: `${paths.length} extension(s)`,
        items,
        emptyMessage: "No extensions loaded",
      },
      () => {
        done();
        this.ui.requestRender();
      },
    );
    return { component: viewer, focus: viewer };
  });
}
```

## Step 5: Remove Startup Prints

In `initExtensions()` (around line 503-528), remove or comment out:

```typescript
// Remove these blocks:
// if (contextFiles.length > 0) {
//   const contextList = contextFiles.map((f) => theme.fg("dim", `  ${f.path}`)).join("\n");
//   this.chatContainer.addChild(new Text(theme.fg("muted", "Loaded context:\n") + contextList, 0, 0));
//   this.chatContainer.addChild(new Spacer(1));
// }

// if (skills.length > 0) {
//   const skillList = skills.map((s) => theme.fg("dim", `  ${s.filePath}`)).join("\n");
//   this.chatContainer.addChild(new Text(theme.fg("muted", "Loaded skills:\n") + skillList, 0, 0));
//   this.chatContainer.addChild(new Spacer(1));
// }
```

Keep skill warnings - those are important to show at startup.

## Step 6: Optional - Add Startup Hint

Replace the removed startup prints with a subtle hint:

```typescript
const counts: string[] = [];
if (contextFiles.length > 0) counts.push(`${contextFiles.length} context`);
if (skills.length > 0) counts.push(`${skills.length} skills`);
if (extensionRunner?.getExtensionPaths().length) {
  counts.push(`${extensionRunner.getExtensionPaths().length} extensions`);
}
if (counts.length > 0) {
  const hint = theme.fg("dim", `Loaded: ${counts.join(", ")} (use /context, /skills, /extensions to view)`);
  this.chatContainer.addChild(new Text(hint, 0, 0));
  this.chatContainer.addChild(new Spacer(1));
}
```

## Testing

1. Start pi in a project with context files, skills, and extensions
2. Verify no long path lists on startup
3. Run `/context` - should show popup with paths
4. Run `/skills` - should show popup with names and paths
5. Run `/extensions` - should show popup with paths and commands
6. Press Escape to close each
7. Verify autocomplete shows all three new commands

## Notes

- Keep skill warnings at startup (they're actionable)
- Could add scrolling later if lists get very long (use SelectList pattern)
- Could add "open in editor" action later
