import FilterBuilder from "@/filter/FilterBuilder";
import Filter from "@/filter/Filter";
import Watchable from "@/model/Watchable";
import FilterImpl from "@/filter/FilterImpl";
import IdentityPhaseImpl from "@/filter/IdentityPhaseImpl";
import Phase from "@/filter/Phase";
import PredicatePhaseImpl from "@/filter/PredicatePhaseImpl";
import { requireNotNull } from "@/util/ObjectUtils";
import SortPhaseImpl from "@/filter/SortPhaseImpl";

class FilterBuilderImpl implements FilterBuilder {

	private watchable: Watchable;

	private itemsExpression: string;

	private predicatePhase: Phase;

	private sortPhase: Phase;

	constructor(watchable: Watchable, itemsExpression: string) {
		this.watchable = requireNotNull(watchable, "watchable");
		this.itemsExpression = requireNotNull(itemsExpression, "itemsExpression");
		this.predicatePhase = new IdentityPhaseImpl();
		this.sortPhase = new IdentityPhaseImpl();
	}

	public withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.predicatePhase = new PredicatePhaseImpl(this.predicatePhase, expression, this.watchable, parameterExpressions);

		return this;
	}

	withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.sortPhase = new SortPhaseImpl(this.sortPhase, expression, this.watchable, parameterExpressions);

		return this;
	}


	public build(): Filter {
		return new FilterImpl(this.watchable, this.itemsExpression, this.predicatePhase, this.sortPhase);
	}

}

export default FilterBuilderImpl;
