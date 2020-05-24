import Watchable from "@/model/Watchable";
import { FilterBuilder, Watcher } from "@/filter/Interfaces";
import { requireNotNull } from "@/util/ObjectUtils";
import WatcherImpl from "@/filter/WatcherImpl";
import FilterBuilderImpl from "@/filter/FilterBuilderImpl";

class Filters {

	public static builder(watchable: Watchable, expression: string): FilterBuilder {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		const watcher: Watcher<any[]> = new WatcherImpl<any[]>(watchable, expression);
		return new FilterBuilderImpl(watchable, watcher);
	}

}

export default Filters;
