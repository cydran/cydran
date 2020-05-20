import Filter from "@/filter/Filter";
import Watchable from "@/model/Watchable";
import Phase from "@/filter/Phase";
import { requireNotNull, isDefined } from "@/util/ObjectUtils";
import Watcher from "@/filter/Watcher";
import WatcherImpl from "@/filter/WatcherImpl";

class FilterImpl implements Filter {

	private filteredItems: any[];

	private watchable: Watchable;

	private itemsWatcher: Watcher<any[]>;

	private phase: Phase;

	constructor(watchable: Watchable, itemsExpression: string, phase: Phase) {
		this.filteredItems = [];
		this.phase = phase;
		this.watchable = requireNotNull(watchable, "watchable");
		requireNotNull(itemsExpression, "itemsExpression");
		this.itemsWatcher = new WatcherImpl<any[]>(this.watchable, itemsExpression, this, () => this.refresh());
		this.phase.setCallback(() => this.refresh());
	}

	public items(): any[] {
		return this.filteredItems;
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
		const result: any[] = this.filter(this.itemsWatcher.get());

		if (isDefined(result)) {
			this.filteredItems = result;
		}
	}

}

export default FilterImpl;
