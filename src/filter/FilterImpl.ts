import Watchable from "@/model/Watchable";
import { requireNotNull, isDefined } from "@/util/ObjectUtils";
import Supplier from "@/pattern/Supplier";
import { Phase, FilterBuilder, Filter, Watcher, Callback } from "@/filter/Interfaces";
import FilterBuilderImpl from "@/filter/FilterBuilderImpl";

class FilterImpl implements Filter, Watcher<any[]> {

	private filteredItems: any[];

	private watchable: Watchable;

	private watcher: Supplier<any[]>;

	private phase: Phase;

	private callbacks: Callback[];

	constructor(watchable: Watchable, watcher: Watcher<any[]>, phase: Phase) {
		this.filteredItems = [];
		this.phase = phase;
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher").addCallback(this, () => this.refresh());
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

	private filter(items: any[]): any[] {
		const source: any[] = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i: number = 0; i < items.length; i++) {
			source.push(items[i]);
		}

		return this.phase.process(source);
	}

	private refresh(): void {
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
