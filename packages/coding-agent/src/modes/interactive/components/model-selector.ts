import { type Model, modelsAreEqual } from "@mariozechner/pi-ai";
import { Container, getEditorKeybindings, Input, Spacer, Text, type TUI } from "@mariozechner/pi-tui";
import { minimatch } from "minimatch";
import type { ModelRegistry } from "../../../core/model-registry.js";
import type { SettingsManager } from "../../../core/settings-manager.js";
import { fuzzyFilter } from "../../../utils/fuzzy.js";
import { theme } from "../theme/theme.js";
import { DynamicBorder } from "./dynamic-border.js";

interface ModelItem {
	provider: string;
	id: string;
	model: Model<any>;
}

interface ScopedModelItem {
	model: Model<any>;
	thinkingLevel: string;
}

/** Display item can be either a provider header or a selectable model */
interface DisplayItem {
	type: "header" | "model";
	provider: string;
	modelItem?: ModelItem;
}

/**
 * Component that renders a model selector with search, grouped by provider
 */
export class ModelSelectorComponent extends Container {
	private searchInput: Input;
	private listContainer: Container;
	private allModels: ModelItem[] = [];
	private filteredModels: ModelItem[] = [];
	private displayItems: DisplayItem[] = [];
	private selectedIndex: number = 0; // Index into displayItems (only counts selectable items)
	private currentModel?: Model<any>;
	private settingsManager: SettingsManager;
	private modelRegistry: ModelRegistry;
	private onSelectCallback: (model: Model<any>) => void;
	private onCancelCallback: () => void;
	private errorMessage?: string;
	private tui: TUI;
	private scopedModels: ReadonlyArray<ScopedModelItem>;

	constructor(
		tui: TUI,
		currentModel: Model<any> | undefined,
		settingsManager: SettingsManager,
		modelRegistry: ModelRegistry,
		scopedModels: ReadonlyArray<ScopedModelItem>,
		onSelect: (model: Model<any>) => void,
		onCancel: () => void,
		initialSearchInput?: string,
	) {
		super();

		this.tui = tui;
		this.currentModel = currentModel;
		this.settingsManager = settingsManager;
		this.modelRegistry = modelRegistry;
		this.scopedModels = scopedModels;
		this.onSelectCallback = onSelect;
		this.onCancelCallback = onCancel;

		// Add top border
		this.addChild(new DynamicBorder());
		this.addChild(new Spacer(1));

		// Add hint about model filtering
		const hintText =
			scopedModels.length > 0
				? "Showing models from --models scope"
				: "Only showing models with configured API keys (see README for details)";
		this.addChild(new Text(theme.fg("warning", hintText), 0, 0));
		this.addChild(new Spacer(1));

		// Create search input
		this.searchInput = new Input();
		if (initialSearchInput) {
			this.searchInput.setValue(initialSearchInput);
		}
		this.searchInput.onSubmit = () => {
			// Enter on search input selects the current item
			const selectedModel = this.getSelectedModel();
			if (selectedModel) {
				this.handleSelect(selectedModel);
			}
		};
		this.addChild(this.searchInput);

		this.addChild(new Spacer(1));

		// Create list container
		this.listContainer = new Container();
		this.addChild(this.listContainer);

		this.addChild(new Spacer(1));

		// Add bottom border
		this.addChild(new DynamicBorder());

		// Load models and do initial render
		this.loadModels().then(() => {
			if (initialSearchInput) {
				this.filterModels(initialSearchInput);
			} else {
				this.updateList();
			}
			// Request re-render after models are loaded
			this.tui.requestRender();
		});
	}

	private async loadModels(): Promise<void> {
		let models: ModelItem[];

		// Use scoped models if provided via --models flag
		if (this.scopedModels.length > 0) {
			models = this.scopedModels.map((scoped) => ({
				provider: scoped.model.provider,
				id: scoped.model.id,
				model: scoped.model,
			}));
		} else {
			// Refresh to pick up any changes to models.json
			this.modelRegistry.refresh();

			// Check for models.json errors
			const loadError = this.modelRegistry.getError();
			if (loadError) {
				this.errorMessage = loadError;
			}

			// Load available models (built-in models still work even if models.json failed)
			try {
				const availableModels = await this.modelRegistry.getAvailable();
				models = availableModels.map((model: Model<any>) => ({
					provider: model.provider,
					id: model.id,
					model,
				}));
			} catch (error) {
				this.allModels = [];
				this.filteredModels = [];
				this.errorMessage = error instanceof Error ? error.message : String(error);
				return;
			}
		}

		// Apply model filters from settings
		models = this.applyModelFilters(models);

		// Sort: current model's provider first, then alphabetically by provider, then by model id
		models.sort((a, b) => {
			const aIsCurrent = modelsAreEqual(this.currentModel, a.model);
			const bIsCurrent = modelsAreEqual(this.currentModel, b.model);
			if (aIsCurrent && !bIsCurrent) return -1;
			if (!aIsCurrent && bIsCurrent) return 1;

			// Group by provider first
			const providerCompare = a.provider.localeCompare(b.provider);
			if (providerCompare !== 0) return providerCompare;

			// Within provider, sort by model id
			return a.id.localeCompare(b.id);
		});

		this.allModels = models;
		this.filteredModels = models;
		this.buildDisplayItems();
		this.selectedIndex = 0;
	}

	/** Apply hidden model and provider filters from settings */
	private applyModelFilters(models: ModelItem[]): ModelItem[] {
		const filters = this.settingsManager.getModelFilters();
		const hiddenPatterns = filters.hidden ?? [];
		const hiddenProviders = filters.hiddenProviders ?? [];

		return models.filter((item) => {
			// Check if provider is hidden
			if (hiddenProviders.includes(item.provider)) {
				return false;
			}

			// Check if model matches any hidden pattern
			for (const pattern of hiddenPatterns) {
				if (minimatch(item.id, pattern, { nocase: true })) {
					return false;
				}
			}

			return true;
		});
	}

	/** Build display items with provider headers */
	private buildDisplayItems(): void {
		this.displayItems = [];

		// Group models by provider
		const groups = new Map<string, ModelItem[]>();
		for (const item of this.filteredModels) {
			const existing = groups.get(item.provider) ?? [];
			existing.push(item);
			groups.set(item.provider, existing);
		}

		// Build display items with headers
		for (const [provider, items] of groups) {
			// Add provider header
			this.displayItems.push({ type: "header", provider });

			// Add models under this provider
			for (const item of items) {
				this.displayItems.push({ type: "model", provider, modelItem: item });
			}
		}
	}

	/** Get all selectable (non-header) indices */
	private getSelectableIndices(): number[] {
		const indices: number[] = [];
		for (let i = 0; i < this.displayItems.length; i++) {
			if (this.displayItems[i].type === "model") {
				indices.push(i);
			}
		}
		return indices;
	}

	/** Get the currently selected model */
	private getSelectedModel(): Model<any> | undefined {
		const selectableIndices = this.getSelectableIndices();
		const displayIndex = selectableIndices[this.selectedIndex];
		const item = this.displayItems[displayIndex];
		return item?.modelItem?.model;
	}

	private filterModels(query: string): void {
		if (query.trim() === "") {
			this.filteredModels = this.allModels;
		} else {
			this.filteredModels = fuzzyFilter(this.allModels, query, ({ id, provider }) => `${id} ${provider}`);
		}
		this.buildDisplayItems();
		this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, this.getSelectableIndices().length - 1));
		this.updateList();
	}

	private updateList(): void {
		this.listContainer.clear();

		const selectableIndices = this.getSelectableIndices();
		if (selectableIndices.length === 0) {
			if (this.errorMessage) {
				const errorLines = this.errorMessage.split("\n");
				for (const line of errorLines) {
					this.listContainer.addChild(new Text(theme.fg("error", line), 0, 0));
				}
			} else {
				this.listContainer.addChild(new Text(theme.fg("muted", "  No matching models"), 0, 0));
			}
			return;
		}

		// Calculate visible window based on selected model position
		const maxVisible = 12;
		const selectedDisplayIndex = selectableIndices[this.selectedIndex] ?? 0;

		// Find a window of display items that includes the selected item
		let startIndex = Math.max(0, selectedDisplayIndex - Math.floor(maxVisible / 2));
		const endIndex = Math.min(startIndex + maxVisible, this.displayItems.length);

		// Adjust if we're near the end
		if (endIndex - startIndex < maxVisible && startIndex > 0) {
			startIndex = Math.max(0, endIndex - maxVisible);
		}

		// Render visible items
		for (let i = startIndex; i < endIndex; i++) {
			const item = this.displayItems[i];
			if (!item) continue;

			if (item.type === "header") {
				// Add blank line before header if there's a previous item (separates provider groups)
				const prevItem = this.displayItems[i - 1];
				if (prevItem && prevItem.type === "model") {
					this.listContainer.addChild(new Spacer(1));
				}
				// Render provider header with accent color
				const headerLine = theme.fg("accent", `${item.provider}`);
				this.listContainer.addChild(new Text(headerLine, 0, 0));
			} else if (item.modelItem) {
				// Find if this is the selected model
				const modelSelectableIndex = selectableIndices.indexOf(i);
				const isSelected = modelSelectableIndex === this.selectedIndex;
				const isCurrent = modelsAreEqual(this.currentModel, item.modelItem.model);

				let line = "";
				if (isSelected) {
					const prefix = theme.fg("accent", "→ ");
					const modelText = theme.fg("accent", item.modelItem.id);
					const checkmark = isCurrent ? theme.fg("success", " ✓") : "";
					line = `${prefix}${modelText}${checkmark}`;
				} else {
					const modelText = `  ${item.modelItem.id}`;
					const checkmark = isCurrent ? theme.fg("success", " ✓") : "";
					line = `${modelText}${checkmark}`;
				}

				this.listContainer.addChild(new Text(line, 0, 0));
			}
		}

		// Add scroll indicator if needed
		if (startIndex > 0 || endIndex < this.displayItems.length) {
			const scrollInfo = theme.fg("muted", `  (${this.selectedIndex + 1}/${selectableIndices.length})`);
			this.listContainer.addChild(new Text(scrollInfo, 0, 0));
		}
	}

	handleInput(keyData: string): void {
		const kb = getEditorKeybindings();
		const selectableIndices = this.getSelectableIndices();

		// Up arrow - move to previous selectable item, wrap to bottom
		if (kb.matches(keyData, "selectUp")) {
			if (selectableIndices.length === 0) return;
			this.selectedIndex = this.selectedIndex === 0 ? selectableIndices.length - 1 : this.selectedIndex - 1;
			this.updateList();
		}
		// Down arrow - move to next selectable item, wrap to top
		else if (kb.matches(keyData, "selectDown")) {
			if (selectableIndices.length === 0) return;
			this.selectedIndex = this.selectedIndex === selectableIndices.length - 1 ? 0 : this.selectedIndex + 1;
			this.updateList();
		}
		// Enter
		else if (kb.matches(keyData, "selectConfirm")) {
			const selectedModel = this.getSelectedModel();
			if (selectedModel) {
				this.handleSelect(selectedModel);
			}
		}
		// Escape or Ctrl+C
		else if (kb.matches(keyData, "selectCancel")) {
			this.onCancelCallback();
		}
		// Pass everything else to search input
		else {
			this.searchInput.handleInput(keyData);
			this.filterModels(this.searchInput.getValue());
		}
	}

	private handleSelect(model: Model<any>): void {
		// Save as new default
		this.settingsManager.setDefaultModelAndProvider(model.provider, model.id);
		this.onSelectCallback(model);
	}

	getSearchInput(): Input {
		return this.searchInput;
	}
}
