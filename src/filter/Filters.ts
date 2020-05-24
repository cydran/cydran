import Watchable from "@/model/Watchable";
import { FilterBuilder, Watcher, Phase, Callback, Filter } from "@/filter/Interfaces";
import { requireNotNull, isDefined } from "@/util/ObjectUtils";
import WatcherImpl from "@/filter/WatcherImpl";
import Supplier from "@/pattern/Supplier";
import SortPhaseImpl from "@/filter/SortPhaseImpl";
import PredicatePhaseImpl from "@/filter/PredicatePhaseImpl";
import IdentityPhaseImpl from "@/filter/IdentityPhaseImpl";

class FilterBuilderImpl implements FilterBuilder {

	private watchable: Watchable;

	private watcher: Watcher<any[]>;

	private phase: Phase;

	constructor(watchable: Watchable, watcher: Watcher<any[]>) {
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher");
		this.phase = new IdentityPhaseImpl();
	}

	public withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new PredicatePhaseImpl(this.phase, expression, this.watchable, parameterExpressions);

		return this;
	}

	public withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new SortPhaseImpl(this.phase, expression, this.watchable, parameterExpressions);

		return this;
	}

	public with(fn: (builder: FilterBuilder) => void): FilterBuilder {
		fn.apply(fn, [this]);

		return this;
	}

	public withLimit(limit: number): FilterBuilder {
		// TODO - Build this using a non-expression based phase

		return this.withPredicate("index < " + limit);
	}

	public build(): Filter {
		return new FilterImpl(this.watchable, this.watcher, this.phase);
	}

}

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

class Filters {

	public static builder(watchable: Watchable, expression: string): FilterBuilder {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		const watcher: Watcher<any[]> = new WatcherImpl<any[]>(watchable, expression);
		return new FilterBuilderImpl(watchable, watcher);
	}

}

export default Filters;
