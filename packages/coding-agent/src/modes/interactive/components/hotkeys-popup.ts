import { Container, getEditorKeybindings, Spacer, Text } from "@mariozechner/pi-tui";
import { theme } from "../theme/theme.js";
import { DynamicBorder } from "./dynamic-border.js";

interface HotkeyItem {
	type: "header" | "hotkey";
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
 * Popup component showing keyboard shortcuts grouped by category.
 * Similar to model selector but displays hotkeys instead.
 */
export class HotkeysPopupComponent extends Container {
	private displayItems: HotkeyItem[] = [];
	private selectedIndex: number = 0;
	private onCancelCallback: () => void;
	private listContainer: Container;

	constructor(config: HotkeysConfig, onCancel: () => void) {
		super();

		this.onCancelCallback = onCancel;

		// Add top border
		this.addChild(new DynamicBorder());
		this.addChild(new Spacer(1));

		// Title
		this.addChild(new Text(theme.bold(theme.fg("accent", "Keyboard Shortcuts")), 1, 0));
		this.addChild(new Text(theme.fg("muted", "Press Escape to close"), 1, 0));
		this.addChild(new Spacer(1));

		// Create list container
		this.listContainer = new Container();
		this.addChild(this.listContainer);

		this.addChild(new Spacer(1));

		// Add bottom border
		this.addChild(new DynamicBorder());

		// Build hotkey items
		this.buildHotkeyItems(config);
		this.updateList();
	}

	private buildHotkeyItems(config: HotkeysConfig): void {
		const { editorKeyDisplay, appKeyDisplay, extensionShortcuts } = config;

		// Navigation
		this.displayItems.push({ type: "header", category: "Navigation" });
		this.displayItems.push({ type: "hotkey", key: "Arrow keys", action: "Move cursor / browse history" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("cursorWordLeft"), action: "Move word left" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("cursorWordRight"), action: "Move word right" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("cursorLineStart"), action: "Start of line" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("cursorLineEnd"), action: "End of line" });

		// Editing
		this.displayItems.push({ type: "header", category: "Editing" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("submit"), action: "Send message" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("newLine"), action: "New line" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("deleteWordBackward"), action: "Delete word" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("deleteToLineStart"), action: "Delete to start" });
		this.displayItems.push({ type: "hotkey", key: editorKeyDisplay("deleteToLineEnd"), action: "Delete to end" });

		// Commands
		this.displayItems.push({ type: "header", category: "Commands" });
		this.displayItems.push({ type: "hotkey", key: "/", action: "Slash commands" });
		this.displayItems.push({ type: "hotkey", key: "!", action: "Run bash command" });
		this.displayItems.push({ type: "hotkey", key: "?", action: "This help popup" });

		// App Controls
		this.displayItems.push({ type: "header", category: "Controls" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("interrupt"), action: "Abort / cancel" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("clear"), action: "Clear / exit (2x)" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("suspend"), action: "Suspend to background" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("expandTools"), action: "Toggle tool output" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("toggleThinking"), action: "Toggle thinking" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("externalEditor"), action: "External editor" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("followUp"), action: "Queue follow-up" });
		this.displayItems.push({ type: "hotkey", key: "Ctrl+V", action: "Paste image" });

		// Model & Thinking
		this.displayItems.push({ type: "header", category: "Model" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("cycleModelForward"), action: "Cycle models" });
		this.displayItems.push({ type: "hotkey", key: appKeyDisplay("cycleThinkingLevel"), action: "Cycle thinking" });

		// Extensions (if any)
		if (extensionShortcuts && extensionShortcuts.size > 0) {
			this.displayItems.push({ type: "header", category: "Extensions" });
			for (const [key, shortcut] of extensionShortcuts) {
				const description = shortcut.description ?? shortcut.extensionPath;
				this.displayItems.push({ type: "hotkey", key, action: description });
			}
		}
	}

	private updateList(): void {
		this.listContainer.clear();

		// Calculate max key width for alignment
		const maxKeyWidth = Math.max(
			...this.displayItems.filter((item) => item.type === "hotkey" && item.key).map((item) => item.key!.length),
		);
		const keyColumnWidth = Math.max(maxKeyWidth + 2, 14); // At least 14, or max + 2 for padding

		for (let i = 0; i < this.displayItems.length; i++) {
			const item = this.displayItems[i];
			if (!item) continue;

			if (item.type === "header") {
				// Add blank line before header (except first)
				if (i > 0) {
					this.listContainer.addChild(new Spacer(1));
				}
				// Render category header with accent color
				const headerLine = theme.fg("accent", item.category ?? "");
				this.listContainer.addChild(new Text(headerLine, 1, 0));
			} else if (item.key && item.action) {
				// Format: "  Ctrl+C              Abort / cancel"
				const keyPart = theme.fg("accent", item.key.padEnd(keyColumnWidth));
				const line = `  ${keyPart} ${item.action}`;
				this.listContainer.addChild(new Text(line, 0, 0));
			}
		}
	}

	handleInput(keyData: string): void {
		const kb = getEditorKeybindings();

		// Escape or Ctrl+C closes
		if (kb.matches(keyData, "selectCancel")) {
			this.onCancelCallback();
		}
		// Ignore all other input - this is a read-only popup
	}
}
