import Filter from "@/filter/Filter";
import Watchable from "@/model/Watchable";
import Phase from "@/filter/Phase";
import { requireNotNull } from "@/util/ObjectUtils";
import Watcher from "@/filter/Watcher";
import WatcherImpl from "@/filter/WatcherImpl";

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
		this.itemsWatcher = new WatcherImpl<any[]>(this.watchable, itemsExpression, this, () => this.refresh());
		this.predicatePhase.setCallback(() => this.refresh());
		this.sortPhase.setCallback(() => this.refresh());
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
