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

/**
 * A simple popup component for displaying read-only lists of information.
 * Used for /context, /skills, /extensions viewers.
 */
export class InfoViewerComponent extends Container {
	private onCancelCallback: () => void;

	constructor(config: InfoViewerConfig, onCancel: () => void) {
		super();
		this.onCancelCallback = onCancel;

		// Top border
		this.addChild(new DynamicBorder());
		this.addChild(new Spacer(1));

		// Title
		this.addChild(new Text(`  ${theme.bold(theme.fg("accent", config.title))}`, 0, 0));
		if (config.subtitle) {
			this.addChild(new Text(`  ${theme.fg("muted", config.subtitle)}`, 0, 0));
		}
		this.addChild(new Spacer(1));

		// Items or empty message
		if (config.items.length === 0) {
			this.addChild(new Text(`  ${theme.fg("dim", config.emptyMessage ?? "None")}`, 0, 0));
		} else {
			for (const item of config.items) {
				const label = theme.fg("accent", item.label);
				const detail = item.detail ? theme.fg("dim", ` ${item.detail}`) : "";
				this.addChild(new Text(`  ${label}${detail}`, 0, 0));
			}
		}

		this.addChild(new Spacer(1));
		this.addChild(new Text(`  ${theme.fg("muted", "Press Escape to close")}`, 0, 0));
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
