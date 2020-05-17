import FilterBuilder from "@/filter/FilterBuilder";
import Watchable from "@/model/Watchable";
import FilterBuilderImpl from "@/filter/FilterBuilderImpl";

function filterBuilder(watchable: Watchable, expression: string): FilterBuilder {
	return new FilterBuilderImpl(watchable, expression);
}

export {
	filterBuilder
};
