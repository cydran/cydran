import Watchable from "@/model/Watchable";
import FilterImpl from "@/filter/FilterImpl";
import IdentityPhaseImpl from "@/filter/IdentityPhaseImpl";
import PredicatePhaseImpl from "@/filter/PredicatePhaseImpl";
import { requireNotNull } from "@/util/ObjectUtils";
import SortPhaseImpl from "@/filter/SortPhaseImpl";
import { Phase, FilterBuilder, Filter, Watcher } from "@/filter/Interfaces";

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

	withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new SortPhaseImpl(this.phase, expression, this.watchable, parameterExpressions);

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

export default FilterBuilderImpl;
