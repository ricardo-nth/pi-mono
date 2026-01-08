---
title: Skill and Context Toggle UI
area: settings
implementation: hybrid
effort: medium
impact: high
risk: low
status: idea
files:
  - packages/coding-agent/src/core/settings-manager.ts
  - packages/coding-agent/src/core/skills.ts
  - packages/coding-agent/src/modes/interactive/interactive-mode.ts
extensionApi: null
created: 2026-01-08
---

# Skill and Context Toggle UI

Allow users to toggle individual skills and context files on/off from the UI.

## Current State

### Skills Backend (Already Implemented)

The `SkillsSettings` interface in `settings-manager.ts` already supports:

```typescript
interface SkillsSettings {
  enabled?: boolean;                // Master toggle
  enableCodexUser?: boolean;        // Toggle by source
  enableClaudeUser?: boolean;
  enableClaudeProject?: boolean;
  enablePiUser?: boolean;
  enablePiProject?: boolean;
  customDirectories?: string[];
  ignoredSkills?: string[];         // Glob patterns to exclude
  includeSkills?: string[];         // Glob patterns to include
}
```

The `loadSkills()` function applies these filters with `minimatch` glob patterns.

### What's Missing

1. **UI to view skill state**: See which skills are loaded vs ignored
2. **UI to toggle skills**: Add/remove from `ignoredSkills` array
3. **Context file toggles**: Similar functionality for context files
4. **Persist changes**: Save to `~/.pi/agent/settings.json`

## Proposed UI

### Option 1: Enhanced `/skills` Viewer

Upgrade the existing `/skills` command to show toggle state:

```
┌─────────────────────────────────────────────────────┐
│  Skills                    15 loaded, 3 disabled    │
├─────────────────────────────────────────────────────┤
│  [x] brainstorming         Explores user intent...  │
│  [x] commit                 Git commit workflow      │
│  [ ] curate                 (disabled)              │
│  [x] interview             Deep interview for...    │
│  ...                                                │
├─────────────────────────────────────────────────────┤
│  [Space] Toggle  [a] Enable all  [n] Disable all    │
│  [Enter] Done    [/] Filter      [Esc] Cancel       │
└─────────────────────────────────────────────────────┘
```

### Option 2: Settings Submenu

Add "Manage Skills" option to `/settings`:

```
Settings
─────────
  Auto-compact           on
  Show images            on
  Thinking level         minimal
→ Manage skills          15/18 enabled
  Manage context         2/2 enabled
```

## Implementation Plan

### Phase 1: Skill Toggles (Medium Effort)

1. **Create `SkillSelectorComponent`**
   - Similar to `SettingsSelectorComponent` 
   - Shows all discovered skills (loaded + ignored)
   - Checkbox-style toggle for each
   - Space to toggle, Enter to save

2. **Add `/skills toggle` subcommand or modify `/skills`**
   - Opens the selector
   - Shows current state from settings

3. **Persist changes**
   - When user toggles skill "foo", add/remove from `ignoredSkills: ["foo"]`
   - Save to settings file
   - Note: Changes take effect on next session (skills are loaded at startup)

4. **Show "restart required" hint**
   - After saving changes: "Skill changes will take effect on next session"

### Phase 2: Context Toggles (Lower Priority)

Context files don't have the same settings infrastructure, so this needs more work:

1. **Add `ContextSettings` interface**
   ```typescript
   interface ContextSettings {
     ignoredFiles?: string[];  // Paths or globs to ignore
   }
   ```

2. **Modify `loadProjectContextFiles()`** to respect settings

3. **Create `ContextSelectorComponent`**

### Phase 3: Hot-Reload (Future)

As discussed, hot-reloading skills would require:
- File watchers on skill directories
- Re-building system prompt mid-session
- Updating `AgentSession` with new prompt

This is medium-high effort and could be a separate feature.

## Technical Notes

### Discovering All Skills (Including Disabled)

Currently `loadSkills()` filters out ignored skills before returning. To show all skills with their state, we'd need:

```typescript
function discoverAllSkills(options): { 
  loaded: Skill[], 
  ignored: Skill[],
  warnings: SkillWarning[] 
}
```

Or modify the existing function to return the full list with an `enabled` flag on each.

### Settings Persistence

Settings are saved to `~/.pi/agent/settings.json`. The `SettingsManager` class has:
- `set(key, value)` - Update a setting
- `save()` - Persist to disk

Would need to add a method like:
```typescript
addIgnoredSkill(skillName: string): void
removeIgnoredSkill(skillName: string): void
```

### CLI Flag Interaction

The `--skills <patterns>` flag already filters skills:
```bash
pi --skills "git-*,docker"  # Only load matching skills
```

The UI toggles should work alongside this, with CLI taking precedence for the session.

## Alternatives Considered

### Skill Library Pattern (User's Idea)

Instead of loading all skills, have a "meta-skill" that scans a skills library and dynamically loads relevant ones based on context. This is more advanced but could reduce startup clutter.

Would require:
- Skills library format/convention
- Skill loader that can work mid-session
- LLM to determine relevance

This is a separate feature from basic toggles.

## Dependencies

- None for Phase 1 (skills)
- Settings infrastructure already exists

## Notes

- Skills loaded at session start, so toggles require restart
- Could add "Apply & Restart" button that calls `/new` after saving
- Extensions cannot be toggled (they register tools/commands at load time)
