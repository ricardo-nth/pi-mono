import type { Component, SelectList } from "@mariozechner/pi-tui";
import { theme } from "../theme/theme.js";

/**
 * Renders autocomplete popup with borders above and below.
 * Wraps the SelectList from Editor for external rendering.
 */
export class AutocompletePopup implements Component {
	private selectList: SelectList | undefined;
	private borderColor: (str: string) => string;

	constructor(borderColor: (str: string) => string = (str) => theme.fg("border", str)) {
		this.borderColor = borderColor;
	}

	setSelectList(list: SelectList | undefined): void {
		this.selectList = list;
	}

	invalidate(): void {
		// No cached state to invalidate
	}

	render(width: number): string[] {
		if (!this.selectList) {
			return [];
		}

		const border = this.borderColor("─".repeat(Math.max(1, width)));
		const listLines = this.selectList.render(width);

		// Only top border - editor provides the bottom border
		return [border, ...listLines];
	}
}
