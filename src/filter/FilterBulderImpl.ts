import { FilterBuilder, Filter, PagedFilter, LimitOffsetFilter } from "filter/Filter";
import Watchable from "interface/ables/Watchable";
import Phase from "phase/Phase";
import Watcher from "digest/Watcher";
import IdentityPhaseImpl from "phase/IdentityPhaseImpl";
import PredicatePhaseImpl from "phase/PredicatePhaseImpl";
import SimplePredicatePhaseImpl from "phase/SimplePredicatePhaseImpl";
import DelegatingPhaseImpl from "phase/DelegatingPhaseImpl";
import SortPhaseImpl from "phase/SortPhaseImpl";

import FilterImpl from "filter/FilterImpl";
import PagedFilterImpl from "filter/PagedFilterImpl";
import LimitOffsetFilterImpl from "filter/LimitOffsetFilterImpl";

import { requireNotNull } from "util/Utils";

class FilterBuilderImpl implements FilterBuilder {
	private watchable: Watchable;

	private watcher: Watcher<any[]>;

	private phase: Phase;

	constructor(watchable: Watchable, watcher: Watcher<any[]>) {
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher");
		this.phase = new IdentityPhaseImpl();
	}

	public withPredicate(
		expression: string,
		...parameterExpressions: string[]
	): FilterBuilder {
		this.phase = new PredicatePhaseImpl(
			this.phase,
			expression,
			this.watchable,
			parameterExpressions
		);

		return this;
	}

	public withSimplePredicate(
		predicate: (index: number, value: any) => boolean
	): FilterBuilder {
		this.phase = new SimplePredicatePhaseImpl(this.phase, predicate);

		return this;
	}

	public withPhase(fn: (input: any[]) => any[]): FilterBuilder {
		this.phase = new DelegatingPhaseImpl(this.phase, fn);

		return this;
	}

	public withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new SortPhaseImpl(
			this.phase,
			expression,
			this.watchable,
			parameterExpressions
		);

		return this;
	}

	public with(fn: (builder: FilterBuilder) => void): FilterBuilder {
		fn.apply(fn, [this]);

		return this;
	}

	public withLimit(limit: number): FilterBuilder {
		return this.withSimplePredicate((index: number, value: any) => index < limit);
	}

	public build(): Filter {
		return new FilterImpl(this.watchable, this.watcher, this.phase);
	}

	public paged(): PagedFilter {
		return new PagedFilterImpl(this.build());
	}

	public limited(): LimitOffsetFilter {
		return new LimitOffsetFilterImpl(this.build());
	}
}

export default FilterBuilderImpl;
