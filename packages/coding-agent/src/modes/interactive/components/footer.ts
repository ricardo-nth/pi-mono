import type { AssistantMessage } from "@mariozechner/pi-ai";
import { type Component, truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";
import { spawnSync } from "child_process";
import { existsSync, type FSWatcher, readFileSync, statSync, watch } from "fs";
import { dirname, join, resolve } from "path";
import type { AgentSession } from "../../../core/agent-session.js";
import { theme } from "../theme/theme.js";

// Nerd font icons
const ICONS = {
	folder: "", // nf-custom-folder
	git: "", // nf-dev-git_branch
	clock: "", // nf-fa-clock_o
};

/**
 * Find the git HEAD path by walking up from cwd.
 * Handles both regular git repos (.git is a directory) and worktrees (.git is a file).
 * Returns the path to the HEAD file if found, null otherwise.
 */
function findGitHeadPath(): string | null {
	let dir = process.cwd();
	while (true) {
		const gitPath = join(dir, ".git");
		if (existsSync(gitPath)) {
			try {
				const stat = statSync(gitPath);
				if (stat.isFile()) {
					// Worktree: .git is a file containing "gitdir: <path>"
					const content = readFileSync(gitPath, "utf8").trim();
					if (content.startsWith("gitdir: ")) {
						const gitDir = content.slice(8);
						const headPath = resolve(dir, gitDir, "HEAD");
						if (existsSync(headPath)) {
							return headPath;
						}
					}
				} else if (stat.isDirectory()) {
					// Regular repo: .git is a directory
					const headPath = join(gitPath, "HEAD");
					if (existsSync(headPath)) {
						return headPath;
					}
				}
			} catch {
				return null;
			}
		}
		const parent = dirname(dir);
		if (parent === dir) {
			return null;
		}
		dir = parent;
	}
}

/**
 * Get time since last commit in human readable format.
 * Returns null if not in a git repo or error.
 */
function getTimeSinceLastCommit(): string | null {
	try {
		const result = spawnSync("git", ["log", "-1", "--format=%ct"], {
			encoding: "utf8",
			timeout: 1000,
			stdio: ["ignore", "pipe", "ignore"],
		});

		if (result.status !== 0 || !result.stdout) return null;

		const timestamp = result.stdout.trim();
		if (!timestamp) return null;

		const commitTime = parseInt(timestamp, 10) * 1000;
		const now = Date.now();
		const diffMs = now - commitTime;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "now";
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		return `${diffDays}d`;
	} catch {
		return null;
	}
}

/**
 * Truncate path to show last N segments with folder icon prefix.
 * Example: ~/Documents/Projects/foo/bar/baz → 󰉋 bar/baz
 */
function truncatePath(fullPath: string, maxSegments: number = 2): string {
	// Replace home with ~
	const home = process.env.HOME || process.env.USERPROFILE;
	let path = fullPath;
	if (home && path.startsWith(home)) {
		path = `~${path.slice(home.length)}`;
	}

	const segments = path.split("/").filter(Boolean);

	if (segments.length <= maxSegments) {
		return `${ICONS.folder} ${path}`;
	}

	// Take last N segments
	const truncated = segments.slice(-maxSegments).join("/");
	return `${ICONS.folder} ${truncated}`;
}

/**
 * Render a progress bar for context usage.
 * Uses block characters: █ for filled, ░ for empty
 */
function renderProgressBar(percentage: number, width: number = 10): string {
	const filled = Math.round((percentage / 100) * width);
	const empty = width - filled;

	const filledStr = "█".repeat(filled);
	const emptyStr = "░".repeat(empty);

	// Color based on percentage
	if (percentage > 90) {
		return theme.fg("error", filledStr) + theme.fg("dim", emptyStr);
	} else if (percentage > 70) {
		return theme.fg("warning", filledStr) + theme.fg("dim", emptyStr);
	}
	return theme.fg("accent", filledStr) + theme.fg("dim", emptyStr);
}

/**
 * Footer component - Powerline-style opinionated layout
 *
 * Line 1: [folder icon] path/segments  [progress bar] XX%  model • reasoning
 * Line 2: [git icon] branch • time_since_commit (only if in git repo)
 */
export class FooterComponent implements Component {
	private session: AgentSession;
	private cachedBranch: string | null | undefined = undefined;
	private gitWatcher: FSWatcher | null = null;
	private onBranchChange: (() => void) | null = null;
	// Kept for API compatibility - may be used by extensions
	private _autoCompactEnabled: boolean = true;
	private _extensionStatuses: Map<string, string> = new Map();
	private cachedTimeSinceCommit: string | null = null;
	private lastCommitCheck: number = 0;

	constructor(session: AgentSession) {
		this.session = session;
	}

	setAutoCompactEnabled(enabled: boolean): void {
		this._autoCompactEnabled = enabled;
	}

	setExtensionStatus(key: string, text: string | undefined): void {
		if (text === undefined) {
			this._extensionStatuses.delete(key);
		} else {
			this._extensionStatuses.set(key, text);
		}
	}

	watchBranch(onBranchChange: () => void): void {
		this.onBranchChange = onBranchChange;
		this.setupGitWatcher();
	}

	private setupGitWatcher(): void {
		if (this.gitWatcher) {
			this.gitWatcher.close();
			this.gitWatcher = null;
		}

		const gitHeadPath = findGitHeadPath();
		if (!gitHeadPath) return;

		try {
			this.gitWatcher = watch(gitHeadPath, () => {
				this.cachedBranch = undefined;
				this.cachedTimeSinceCommit = null;
				if (this.onBranchChange) {
					this.onBranchChange();
				}
			});
		} catch {
			// Silently fail
		}
	}

	dispose(): void {
		if (this.gitWatcher) {
			this.gitWatcher.close();
			this.gitWatcher = null;
		}
	}

	invalidate(): void {
		this.cachedBranch = undefined;
		this.cachedTimeSinceCommit = null;
	}

	private getCurrentBranch(): string | null {
		if (this.cachedBranch !== undefined) {
			return this.cachedBranch;
		}

		try {
			const gitHeadPath = findGitHeadPath();
			if (!gitHeadPath) {
				this.cachedBranch = null;
				return null;
			}
			const content = readFileSync(gitHeadPath, "utf8").trim();

			if (content.startsWith("ref: refs/heads/")) {
				this.cachedBranch = content.slice(16);
			} else {
				this.cachedBranch = "detached";
			}
		} catch {
			this.cachedBranch = null;
		}

		return this.cachedBranch;
	}

	private getTimeSinceCommit(): string | null {
		// Cache for 30 seconds to avoid running git too often
		const now = Date.now();
		if (now - this.lastCommitCheck < 30000 && this.cachedTimeSinceCommit !== null) {
			return this.cachedTimeSinceCommit;
		}

		this.lastCommitCheck = now;
		this.cachedTimeSinceCommit = getTimeSinceLastCommit();
		return this.cachedTimeSinceCommit;
	}

	render(width: number): string[] {
		const state = this.session.state;
		const lines: string[] = [];

		// Get last assistant message for context calculation
		const lastAssistantMessage = state.messages
			.slice()
			.reverse()
			.find((m) => m.role === "assistant" && m.stopReason !== "aborted") as AssistantMessage | undefined;

		// Calculate context percentage
		const contextTokens = lastAssistantMessage
			? lastAssistantMessage.usage.input +
				lastAssistantMessage.usage.output +
				lastAssistantMessage.usage.cacheRead +
				lastAssistantMessage.usage.cacheWrite
			: 0;
		const contextWindow = state.model?.contextWindow || 200000;
		const contextPercent = contextWindow > 0 ? (contextTokens / contextWindow) * 100 : 0;

		// === LINE 1: Path | Context Bar | Model ===
		const pathStr = truncatePath(process.cwd(), 2);
		const progressBar = renderProgressBar(contextPercent, 8);
		const percentStr = `${contextPercent.toFixed(0)}%`;

		// Model + thinking level (right side)
		const modelName = state.model?.id || "no-model";
		let rightSide = modelName;
		if (state.model?.reasoning) {
			const thinkingLevel = state.thinkingLevel || "off";
			if (thinkingLevel !== "off") {
				rightSide = `${modelName} • ${thinkingLevel}`;
			}
		}

		// Build line 1
		const leftPart = `${pathStr}  ${progressBar} ${percentStr}`;
		const leftWidth = visibleWidth(leftPart);
		const rightWidth = visibleWidth(rightSide);

		let line1: string;
		const minPadding = 2;
		if (leftWidth + minPadding + rightWidth <= width) {
			const padding = " ".repeat(width - leftWidth - rightWidth);
			line1 = leftPart + padding + rightSide;
		} else {
			// Truncate if needed
			line1 = leftPart;
		}

		lines.push(theme.fg("dim", line1));

		// === LINE 2: Git info (only if in git repo) ===
		const branch = this.getCurrentBranch();
		if (branch) {
			const timeSince = this.getTimeSinceCommit();
			let gitLine = `${ICONS.git} ${branch}`;
			if (timeSince) {
				gitLine += ` • ${ICONS.clock} ${timeSince}`;
			}
			lines.push(theme.fg("dim", gitLine));
		}

		return lines;
	}
}
