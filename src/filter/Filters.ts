import Watchable from "interface/ables/Watchable";
import Watcher from "digest/Watcher";
import WatcherImpl from "digest/WatcherImpl";
import FilterBuilderImpl from "filter/FilterBulderImpl";
import { FilterBuilder } from "filter/Filter";
import { requireNotNull } from "util/Utils";

class Filters {
	public static builder(watchable: Watchable, expression: string): FilterBuilder {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		const watcher: Watcher<any[]> = new WatcherImpl<any[]>(watchable, expression);
		return new FilterBuilderImpl(watchable, watcher);
	}
}

export default Filters;