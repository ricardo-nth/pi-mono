import { Container, getEditorKeybindings, Spacer, Text } from "@mariozechner/pi-tui";
import { theme } from "../theme/theme.js";
import { DynamicBorder } from "./dynamic-border.js";

interface HotkeyItem {
	type: "header" | "hotkey" | "spacer";
	category?: string;
	key?: string;
	action?: string;
}

interface HotkeysConfig {
	editorKeyDisplay: (action: string) => string;
	appKeyDisplay: (action: string) => string;
	extensionShortcuts?: Map<string, { description?: string; extensionPath: string }>;
}

/**
 * Popup component showing keyboard shortcuts in 3-column layout.
 * Col 1: Navigation, Editing
 * Col 2: Controls
 * Col 3: Model, Commands (+ Extensions)
 */
export class HotkeysPopupComponent extends Container {
	private col1: HotkeyItem[] = [];
	private col2: HotkeyItem[] = [];
	private col3: HotkeyItem[] = [];
	private onCancelCallback: () => void;
	private listContainer: Container;

	constructor(config: HotkeysConfig, onCancel: () => void) {
		super();

		this.onCancelCallback = onCancel;

		// Add top border
		this.addChild(new DynamicBorder());
		this.addChild(new Spacer(1));

		// Title (indented to align with columns)
		this.addChild(new Text("  " + theme.bold(theme.fg("accent", "Keyboard Shortcuts")), 0, 0));
		this.addChild(new Text("  " + theme.fg("muted", "Press Escape or ? to close"), 0, 0));
		this.addChild(new Spacer(1));

		// Create list container
		this.listContainer = new Container();
		this.addChild(this.listContainer);

		this.addChild(new Spacer(1));

		// Add bottom border
		this.addChild(new DynamicBorder());

		// Build hotkey items into columns
		this.buildColumns(config);
		this.updateList();
	}

	private buildColumns(config: HotkeysConfig): void {
		const { editorKeyDisplay, appKeyDisplay, extensionShortcuts } = config;

		// COLUMN 1: Navigation + Editing
		this.col1.push({ type: "header", category: "Navigation" });
		this.col1.push({ type: "hotkey", key: "Arrows", action: "Move / history" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("cursorWordLeft"), action: "Word left" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("cursorWordRight"), action: "Word right" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("cursorLineStart"), action: "Line start" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("cursorLineEnd"), action: "Line end" });

		this.col1.push({ type: "spacer" }); // Blank line before header
		this.col1.push({ type: "header", category: "Editing" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("submit"), action: "Send" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("newLine"), action: "New line" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("deleteWordBackward"), action: "Delete word" });
		this.col1.push({ type: "hotkey", key: "Ctrl+K", action: "Del to end" });
		this.col1.push({ type: "hotkey", key: editorKeyDisplay("deleteToLineStart"), action: "Del to start" });

		// COLUMN 2: Controls + Model
		this.col2.push({ type: "header", category: "Controls" });
		this.col2.push({ type: "hotkey", key: appKeyDisplay("interrupt"), action: "Interrupt" });
		this.col2.push({ type: "hotkey", key: appKeyDisplay("clear"), action: "Clear" });
		this.col2.push({ type: "hotkey", key: "Ctrl+C ×2", action: "Exit" });
		this.col2.push({ type: "hotkey", key: "Ctrl+D", action: "Exit (empty)" });
		this.col2.push({ type: "hotkey", key: appKeyDisplay("suspend"), action: "Suspend" });
		this.col2.push({ type: "hotkey", key: appKeyDisplay("expandTools"), action: "Tool output" });
		this.col2.push({ type: "hotkey", key: appKeyDisplay("toggleThinking"), action: "Thinking" });
		this.col2.push({ type: "hotkey", key: appKeyDisplay("externalEditor"), action: "Ext. editor" });
		this.col2.push({ type: "hotkey", key: appKeyDisplay("followUp"), action: "Follow-up" });
		this.col2.push({ type: "hotkey", key: "Ctrl+V", action: "Paste image" });
		this.col2.push({ type: "hotkey", key: "Drop files", action: "Attach" });

		// COLUMN 3: Model + Commands + Extensions
		this.col3.push({ type: "header", category: "Model" });
		this.col3.push({ type: "hotkey", key: appKeyDisplay("selectModel"), action: "Select model" });
		this.col3.push({ type: "hotkey", key: appKeyDisplay("cycleModelForward"), action: "Cycle model" });
		this.col3.push({ type: "hotkey", key: appKeyDisplay("cycleThinkingLevel"), action: "Cycle thinking" });

		this.col3.push({ type: "spacer" });
		this.col3.push({ type: "header", category: "Commands" });
		this.col3.push({ type: "hotkey", key: "/", action: "Slash commands" });
		this.col3.push({ type: "hotkey", key: "!", action: "Bash command" });
		this.col3.push({ type: "hotkey", key: "!!", action: "Silent bash" });
		this.col3.push({ type: "hotkey", key: "?", action: "This popup" });

		// Extensions (if any)
		if (extensionShortcuts && extensionShortcuts.size > 0) {
			this.col3.push({ type: "spacer" });
			this.col3.push({ type: "header", category: "Extensions" });
			for (const [key, shortcut] of extensionShortcuts) {
				const desc = shortcut.description ?? shortcut.extensionPath;
				const truncDesc = desc.length > 12 ? desc.slice(0, 11) + "…" : desc;
				this.col3.push({ type: "hotkey", key, action: truncDesc });
			}
		}
	}

	private renderItem(item: HotkeyItem | undefined, keyWidth: number): string {
		if (!item) return "";
		if (item.type === "spacer") return "";
		if (item.type === "header") {
			return theme.fg("accent", item.category ?? "");
		}
		if (item.key && item.action) {
			const keyPart = theme.fg("accent", item.key.padEnd(keyWidth));
			return `${keyPart} ${item.action}`;
		}
		return "";
	}

	private getKeyWidth(col: HotkeyItem[]): number {
		const keys = col.filter((i) => i.type === "hotkey" && i.key).map((i) => i.key!.length);
		return Math.max(...keys, 8) + 1;
	}

	private getColWidth(col: HotkeyItem[], keyWidth: number): number {
		let maxWidth = 0;
		for (const item of col) {
			if (item.type === "header") {
				maxWidth = Math.max(maxWidth, (item.category ?? "").length);
			} else if (item.type === "hotkey" && item.key && item.action) {
				// key (padded) + space + action
				maxWidth = Math.max(maxWidth, keyWidth + 1 + item.action.length);
			}
		}
		return maxWidth;
	}

	private updateList(): void {
		this.listContainer.clear();

		// Calculate key widths for each column
		const keyWidth1 = this.getKeyWidth(this.col1);
		const keyWidth2 = this.getKeyWidth(this.col2);
		const keyWidth3 = this.getKeyWidth(this.col3);

		// Calculate actual column widths based on content
		const colWidth1 = this.getColWidth(this.col1, keyWidth1);
		const colWidth2 = this.getColWidth(this.col2, keyWidth2);

		const gap = 4;

		// Find max rows for top-aligned columns
		const maxRows = Math.max(this.col1.length, this.col2.length, this.col3.length);

		// Pad columns at bottom with empty items (top-aligned)
		const pad1 = maxRows - this.col1.length;
		const pad2 = maxRows - this.col2.length;
		const pad3 = maxRows - this.col3.length;

		const paddedCol1 = [...this.col1, ...Array(pad1).fill({ type: "spacer" })];
		const paddedCol2 = [...this.col2, ...Array(pad2).fill({ type: "spacer" })];
		const paddedCol3 = [...this.col3, ...Array(pad3).fill({ type: "spacer" })];

		// Render rows
		for (let i = 0; i < maxRows; i++) {
			const item1 = paddedCol1[i];
			const item2 = paddedCol2[i];
			const item3 = paddedCol3[i];

			const str1 = this.renderItem(item1, keyWidth1);
			const str2 = this.renderItem(item2, keyWidth2);
			const str3 = this.renderItem(item3, keyWidth3);

			// Calculate visible widths (strip ANSI)
			const vis1 = str1.replace(/\x1b\[[0-9;]*m/g, "").length;
			const vis2 = str2.replace(/\x1b\[[0-9;]*m/g, "").length;

			// Pad each column to calculated width
			const padded1 = str1 + " ".repeat(Math.max(0, colWidth1 - vis1));
			const padded2 = str2 + " ".repeat(Math.max(0, colWidth2 - vis2));

			const line = `  ${padded1}${" ".repeat(gap)}${padded2}${" ".repeat(gap)}${str3}`;
			this.listContainer.addChild(new Text(line, 0, 0));
		}
	}

	handleInput(keyData: string): void {
		const kb = getEditorKeybindings();

		// Escape, Ctrl+C, or ? closes
		if (kb.matches(keyData, "selectCancel") || keyData === "?") {
			this.onCancelCallback();
		}
	}
}
