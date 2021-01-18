import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

import Watcher from "digest/Watcher";
import Supplier from "interface/Supplier";
import Callback from "interface/Callback";
import Phase from "phase/Phase";
import Watchable from "interface/ables/Watchable";
import FilterBuilderImpl from "filter/FilterBulderImpl";
import { Filter, FilterBuilder } from "filter/Filter";
import { requireNotNull, isDefined } from "util/Utils";

class FilterImpl implements Filter, Watcher<any[]> {
	private filteredItems: any[];

	private watchable: Watchable;

	private watcher: Supplier<any[]>;

	private phase: Phase;

	private callbacks: Callback[];

	private logger: Logger;

	constructor(watchable: Watchable, watcher: Watcher<any[]>, phase: Phase) {
		this.logger = LoggerFactory.getLogger("FilterImpl");
		this.filteredItems = [];
		this.phase = phase;
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher").addCallback(this, () =>
			this.refresh()
		);
		this.callbacks = [];
		this.phase.setCallback(() => this.refresh());
	}

	public items(): any[] {
		return this.filteredItems;
	}

	public extend(): FilterBuilder {
		return new FilterBuilderImpl(this.watchable, this);
	}

	public get(): any[] {
		return this.items();
	}

	public addCallback(context: any, callback: () => void): Watcher<any[]> {
		requireNotNull(context, "context");
		requireNotNull(callback, "callback");

		this.callbacks.push({
			context: context,
			fn: callback
		});

		return this;
	}

	public invalidate(): void {
		this.logger.trace("Invalidated");
		this.phase.invalidate();
	}

	private filter(items: any[]): any[] {
		const source: any[] = [];

		this.logger.ifTrace(() => ({
			message: "Before filtering",
			items: items
		}));

		// tslint:disable-next-line:prefer-for-of
		for (let i: number = 0; i < items.length; i++) {
			source.push(items[i]);
		}

		this.logger.trace("Invalidated");

		const result: any[] = this.phase.process(source);

		this.logger.ifTrace(() => ({
			message: "After filtering",
			items: result
		}));

		return result;
	}

	public refresh(): void {
		const result: any[] = this.filter(this.watcher.get());

		if (isDefined(result)) {
			this.filteredItems = result;

			for (const callback of this.callbacks) {
				callback.fn.apply(callback.fn, []);
			}
		}
	}
}

export default FilterImpl;
