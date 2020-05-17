import Filter from "@/filter/Filter";
import Watchable from "@/model/Watchable";
import { asIdentity } from "@/model/Reducers";
import Phase from "@/filter/Phase";
import { requireNotNull } from "@/util/ObjectUtils";

interface Watcher<T> {

	get(): T;

}

class WatcherImpl<T> implements Watcher<T> {

	private value: any;

	private callback: () => void;

	constructor(watchable: Watchable, expression: string, callback: () => void) {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		this.callback = requireNotNull(callback, "callback");
		this.value = watchable.evaluate(expression);
		watchable.watch(expression, this.onChange, asIdentity, this);
	}

	public onChange(previous: any, current: any): void {
		this.value = current;
		this.callback();
	}

	public get(): T {
		return this.value as T;
	}

}

class FilterImpl implements Filter {

	private filteredItems: any[];

	private watchable: Watchable;

	private itemsWatcher: Watcher<any[]>;

	private predicatePhase: Phase;

	private sortPhase: Phase;

	constructor(watchable: Watchable, itemsExpression: string, predicatePhase: Phase, sortPhase: Phase) {
		this.predicatePhase = predicatePhase;
		this.sortPhase = sortPhase;
		this.watchable = requireNotNull(watchable, "watchable");
		requireNotNull(itemsExpression, "itemsExpression");
		this.itemsWatcher = new WatcherImpl<any[]>(this.watchable, itemsExpression, () => this.refresh());
	}

	public items(): any[] {
		return this.filteredItems;
	}

	private filter(items: any[]): any[] {
		const reduced: any[] = this.predicatePhase.process(items);
		const sorted: any[] = this.sortPhase.process(reduced);
		return sorted;
	}

	private refresh(): void {
		this.filteredItems = this.filter(this.itemsWatcher.get());
	}

}

export default FilterImpl;
