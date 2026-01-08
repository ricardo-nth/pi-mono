import { Container, Spacer, Text, visibleWidth } from "@mariozechner/pi-tui";
import { basename, dirname } from "path";
import { APP_NAME, VERSION } from "../../../config.js";
import type { Skill } from "../../../core/skills.js";
import { theme } from "../theme/theme.js";
import { DynamicBorder } from "./dynamic-border.js";

// ASCII art logos for different app names
const ASCII_LOGOS: Record<string, string[]> = {
	pi: [
		"        ___",
		"       /\\  \\",
		"      /::\\  \\",
		"     /:/\\:\\  \\",
		"    /::\\~\\:\\  \\",
		"   /:/\\:\\ \\:\\__\\",
		"   \\/__\\:\\/:/  /",
		"        \\::/  /",
		"         \\/__/",
	],
	po: [
		"⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿",
		"⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿",
		"⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿",
		"⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿",
		"⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿",
		"⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿",
		"⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿",
		"⠟⠋⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠘⠿",
		"⠇⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠸",
		"⠃⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠸",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠘",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠘⠘",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
		"⠀⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁⠁",
	],
	// Default fallback
	default: ["  ┌─┐", "  │ │", "  └─┘"],
};

interface ContextFile {
	path: string;
	content: string;
}

interface WelcomeScreenConfig {
	contextFiles: ContextFile[];
	skills: Skill[];
	extensionPaths: string[];
	terminalWidth?: number;
}

/**
 * Truncate a path to show meaningful context.
 * Shows: filename (parent/grandparent)
 * e.g., "AGENTS.md (Projects/pi-mono)" or "CLAUDE.md (~/.claude)"
 */
function formatContextPath(fullPath: string): string {
	const home = process.env.HOME || process.env.USERPROFILE || "";
	let path = fullPath;

	// Replace home with ~
	if (home && path.startsWith(home)) {
		path = `~${path.slice(home.length)}`;
	}

	const parts = path.split("/").filter(Boolean);
	const filename = parts.pop() || path;

	// Get up to 2 parent directories for context
	const parents = parts.slice(-2).join("/");

	if (parents) {
		return `${filename} (${parents})`;
	}
	return filename;
}

/**
 * Format skill name from its file path.
 * Returns the parent directory name (skill folder name).
 */
function formatSkillName(skill: Skill): string {
	// Use the skill's name if available, otherwise derive from path
	if (skill.name) {
		return skill.name;
	}
	// Fallback: get parent directory name
	return basename(dirname(skill.filePath));
}

/**
 * Format extension name from its file path.
 */
function formatExtensionName(extPath: string): string {
	const filename = basename(extPath);
	// Remove .ts or .js extension
	return filename.replace(/\.(ts|js)$/, "");
}

/**
 * Split an array into two roughly equal halves for two-column display.
 */
function splitIntoTwoColumns<T>(items: T[]): [T[], T[]] {
	const midpoint = Math.ceil(items.length / 2);
	return [items.slice(0, midpoint), items.slice(midpoint)];
}

/**
 * Welcome screen component showing ASCII art, version, and loaded items.
 */
export class WelcomeScreenComponent extends Container {
	constructor(config: WelcomeScreenConfig) {
		super();

		const { contextFiles, skills, extensionPaths } = config;
		const termWidth = config.terminalWidth || process.stdout.columns || 80;

		// Get ASCII art for app name (or default)
		const asciiLines = ASCII_LOGOS[APP_NAME.toLowerCase()] || ASCII_LOGOS.default;

		// Calculate the width of the ASCII art
		const asciiWidth = Math.max(...asciiLines.map((line) => visibleWidth(line)));

		// Build the right side content (version + stats)
		const rightContent: string[] = [];
		rightContent.push(theme.bold(theme.fg("accent", APP_NAME)) + theme.fg("dim", ` v${VERSION}`));
		rightContent.push("");

		// Add counts summary
		const counts: string[] = [];
		if (contextFiles.length > 0) counts.push(`${contextFiles.length} context`);
		if (skills.length > 0) counts.push(`${skills.length} skill${skills.length > 1 ? "s" : ""}`);
		if (extensionPaths.length > 0)
			counts.push(`${extensionPaths.length} extension${extensionPaths.length > 1 ? "s" : ""}`);

		if (counts.length > 0) {
			rightContent.push(theme.fg("dim", counts.join(" · ")));
		}

		rightContent.push(theme.fg("dim", "? for help"));

		// Render ASCII art centered
		const asciiPadding = Math.max(0, Math.floor((termWidth - asciiWidth) / 2));
		const asciiPadStr = " ".repeat(asciiPadding);

		for (let i = 0; i < asciiLines.length; i++) {
			this.addChild(new Text(asciiPadStr + theme.fg("accent", asciiLines[i]), 0, 0));
		}

		this.addChild(new Spacer(1));

		// Render version info centered below ASCII art
		const rightWidth = Math.max(...rightContent.map((line) => visibleWidth(line.replace(/\x1b\[[0-9;]*m/g, ""))));
		const rightPadding = Math.max(0, Math.floor((termWidth - rightWidth) / 2));
		const rightPadStr = " ".repeat(rightPadding);

		for (const line of rightContent) {
			this.addChild(new Text(rightPadStr + line, 0, 0));
		}

		this.addChild(new Spacer(1));

		// Only show table if there are items to display
		if (contextFiles.length > 0 || skills.length > 0 || extensionPaths.length > 0) {
			this.addChild(new DynamicBorder());
			this.addChild(new Spacer(1));

			// Format items
			const contextItems = contextFiles.map((f) => formatContextPath(f.path));
			const skillItems = skills.map(formatSkillName);
			const extItems = extensionPaths.map(formatExtensionName);

			// Split skills into two columns
			const [skillsCol1, skillsCol2] = splitIntoTwoColumns(skillItems);

			// Build column structure:
			// | Context/Extensions | Skills (col1) | Skills (col2) |
			// Context and Extensions are stacked in the left column

			const colGap = 4;

			// Left column: Context + Extensions stacked
			const leftHeader = contextItems.length > 0 ? "Context" : extItems.length > 0 ? "Extensions" : "";
			const leftItems: string[] = [...contextItems];
			// Add separator and extensions if both exist
			if (contextItems.length > 0 && extItems.length > 0) {
				leftItems.push(""); // blank line
				leftItems.push(theme.fg("accent", "Extensions")); // sub-header
				leftItems.push(...extItems);
			} else if (extItems.length > 0) {
				leftItems.push(...extItems);
			}

			// Calculate column widths
			const leftColWidth = Math.max(
				visibleWidth(leftHeader),
				visibleWidth("Extensions"),
				...contextItems.map((i) => visibleWidth(i)),
				...extItems.map((i) => visibleWidth(i)),
			);

			const skillsCol1Width = Math.max(visibleWidth("Skills"), ...skillsCol1.map((i) => visibleWidth(i)));

			const skillsCol2Width = skillsCol2.length > 0 ? Math.max(...skillsCol2.map((i) => visibleWidth(i))) : 0;

			// Render header row
			let headerLine = "  ";
			if (leftItems.length > 0) {
				const header = theme.fg("accent", leftHeader);
				headerLine += header + " ".repeat(Math.max(0, leftColWidth - visibleWidth(leftHeader)));
				headerLine += " ".repeat(colGap);
			}
			if (skillItems.length > 0) {
				const skillsHeader = theme.fg("accent", "Skills");
				headerLine += skillsHeader + " ".repeat(Math.max(0, skillsCol1Width - visibleWidth("Skills")));
				if (skillsCol2.length > 0) {
					headerLine += " ".repeat(colGap);
					// Second skills column has no header, just padding
					headerLine += " ".repeat(skillsCol2Width);
				}
			}
			this.addChild(new Text(headerLine, 0, 0));

			// Render separator
			let separatorLine = "  ";
			if (leftItems.length > 0) {
				separatorLine += theme.fg("dim", "─".repeat(leftColWidth));
				separatorLine += " ".repeat(colGap);
			}
			if (skillItems.length > 0) {
				separatorLine += theme.fg("dim", "─".repeat(skillsCol1Width));
				if (skillsCol2.length > 0) {
					separatorLine += " ".repeat(colGap);
					separatorLine += theme.fg("dim", "─".repeat(skillsCol2Width));
				}
			}
			this.addChild(new Text(separatorLine, 0, 0));

			// Render data rows
			const maxRows = Math.max(leftItems.length, skillsCol1.length, skillsCol2.length);
			for (let row = 0; row < maxRows; row++) {
				let rowLine = "  ";

				// Left column (context + extensions)
				if (leftItems.length > 0) {
					const item = leftItems[row] || "";
					// Check if this is the "Extensions" sub-header (already styled)
					const isSubHeader = item.includes("\x1b[");
					const displayItem = isSubHeader ? item : theme.fg("dim", item);
					const itemWidth = visibleWidth(item.replace(/\x1b\[[0-9;]*m/g, ""));
					rowLine += displayItem + " ".repeat(Math.max(0, leftColWidth - itemWidth));
					rowLine += " ".repeat(colGap);
				}

				// Skills column 1
				if (skillItems.length > 0) {
					const item = skillsCol1[row] || "";
					const displayItem = theme.fg("dim", item);
					const itemWidth = visibleWidth(item);
					rowLine += displayItem + " ".repeat(Math.max(0, skillsCol1Width - itemWidth));

					// Skills column 2
					if (skillsCol2.length > 0) {
						rowLine += " ".repeat(colGap);
						const item2 = skillsCol2[row] || "";
						const displayItem2 = theme.fg("dim", item2);
						rowLine += displayItem2;
					}
				}

				this.addChild(new Text(rowLine, 0, 0));
			}

			this.addChild(new Spacer(1));
			this.addChild(new DynamicBorder());
		}
	}
}
