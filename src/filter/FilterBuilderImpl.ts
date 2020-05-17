import FilterBuilder from "@/filter/FilterBuilder";
import Filter from "@/filter/Filter";
import Watchable from "@/model/Watchable";
import ObjectUtils from "@/util/ObjectUtils";
import FilterImpl from "@/filter/FilterImpl";
import IdentityPhaseImpl from "@/filter/IdentityPhaseImpl";
import Phase from "@/filter/Phase";
import PredicatePhaseImpl from "@/filter/PredicatePhaseImpl";

const requireNotNull = ObjectUtils.requireNotNull;

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

	public withPredicate(expression: string): FilterBuilder {
		this.predicatePhase = new PredicatePhaseImpl(this.predicatePhase);

		return this;
	}

	withSort(expression: string): FilterBuilder {
		return this;
	}


	public build(): Filter {
		return new FilterImpl(this.watchable, this.itemsExpression, this.predicatePhase, this.sortPhase);
	}

}

export default FilterBuilderImpl;
