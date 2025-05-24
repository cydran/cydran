import Watchable from "interface/ables/Watchable";
import Watcher from "digest/Watcher";
import Logger from "log/Logger";
import { FilterBuilder, Filter, PagedFilter, LimitOffsetFilter } from "filter/Filter";
import Phase from "filter/Phase";
import IdentityPhaseImpl from "filter/IdentityPhaseImpl";
import PredicatePhaseImpl from "filter/PredicatePhaseImpl";
import SimplePredicatePhaseImpl from "filter/SimplePredicatePhaseImpl";
import DelegatingPhaseImpl from "filter/DelegatingPhaseImpl";
import SortPhaseImpl from "filter/SortPhaseImpl";
import Provider from "interface/Provider";
import Callback from "interface/Callback";
import { requireNotNull, isDefined, equals, defaulted } from 'util/Utils';
import { DEFAULT_EQUALS_DEPTH } from "CydranConstants";
import getLogger from "log/getLogger";

class FilterBuilderImpl implements FilterBuilder {

	private watchable: Watchable;

	private watcher: Watcher<unknown[]>;

	private phase: Phase;

	constructor(watchable: Watchable, watcher: Watcher<unknown[]>) {
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher");
		this.phase = new IdentityPhaseImpl();
	}

	public withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new PredicatePhaseImpl(this.phase, expression, this.watchable, parameterExpressions);

		return this;
	}

	public withSimplePredicate(predicate: (index: number, value: unknown) => boolean): FilterBuilder {
		this.phase = new SimplePredicatePhaseImpl(this.phase, predicate);

		return this;
	}

	public withPhase(fn: (input: unknown[]) => unknown[]): FilterBuilder {
		this.phase = new DelegatingPhaseImpl(this.phase, fn);

		return this;
	}

	public withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder {
		this.phase = new SortPhaseImpl(this.phase, expression, this.watchable, parameterExpressions);

		return this;
	}

	public with(fn: (builder: FilterBuilder) => void): FilterBuilder {
		fn.apply(fn, [this]);

		return this;
	}

	public withLimit(limit: number): FilterBuilder {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return this.withSimplePredicate((index: number, value: unknown) => index < limit);
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

class FilterImpl implements Filter, Watcher<unknown[]> {

	private filteredItems: unknown[];

	private watchable: Watchable;

	private watcher: Provider<unknown[]>;

	private phase: Phase;

	private callbacks: Callback[];

	private logger: Logger;

	constructor(watchable: Watchable, watcher: Watcher<unknown[]>, phase: Phase) {
		this.logger = getLogger(`filter`);
		this.filteredItems = [];
		this.phase = phase;
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher").addCallback(this, () =>
			this.refresh()
		);
		this.callbacks = [];
		this.phase.setCallback(() => this.refresh());
		this.refresh();
	}

	public items(): unknown[] {
		return this.filteredItems;
	}

	public extend(): FilterBuilder {
		return new FilterBuilderImpl(this.watchable, this);
	}

	public get(): unknown[] {
		return this.items();
	}

	public addCallback(thisObject: Object, callback: () => void): Watcher<unknown[]> {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");

		this.callbacks.push({ thisObject: thisObject, fn: callback });

		return this;
	}

	public invalidate(): void {
		this.logger.trace("Invalidated");
		this.phase.invalidate();
	}

	private filter(items: unknown[]): unknown[] {
		const source: unknown[] = [];
		const actualItems: unknown[] = defaulted(items, []);

		this.logger.ifTrace(() => ({ message: "Before filtering", items: actualItems }));

		// eslint-disable-next-line:prefer-for-of
		for (let i: number = 0; i < actualItems.length; i++) {
			source.push(actualItems[i]);
		}

		this.logger.trace("Invalidated");

		const result: unknown[] = this.phase.process(source);

		this.logger.ifTrace(() => ({ message: "After filtering", items: result }));

		return result;
	}

	public refresh(): void {
		const result: unknown[] = this.filter(this.watcher.get());

		if (isDefined(result)) {
			this.filteredItems = result;

			for (const callback of this.callbacks) {
				callback.fn.apply(callback.fn, []);
			}
		}
	}
}

class LimitOffsetFilterImpl implements LimitOffsetFilter {
	private parent: FilterImpl;

	private limiting: FilterImpl;

	private limit: number;

	private offset: number;

	private logger: Logger;

	constructor(parent: Filter) {
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.logger = getLogger(`limitOffsetFilter`);
		this.limiting = this.parent
			.extend()
			.withPhase((input: unknown[]) => {
				let result: unknown[] = input.slice(this.offset);

				if (isDefined(this.limit)) {
					result = result.slice(0, this.limit);
				}

				return result;
			})
			.build() as FilterImpl;
		this.offset = 0;
		this.limit = null;
	}

	public getLimit(): number {
		return this.limit;
	}

	public setLimit(limit: number): void {
		this.logger.ifTrace(() => `Limit set to: ${limit}`);
		this.limit = isDefined(limit) ? Math.floor(limit) : null;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public getOffset(): number {
		return this.offset;
	}

	public setOffset(offset: number): void {
		this.logger.ifTrace(() => `Offset set to: ${offset}`);
		this.offset = isDefined(offset) ? Math.floor(offset) : 0;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public setLimitAndOffset(limit: number, offset: number): void {
		this.logger.ifTrace(() => `Limit set to: ${limit}`);
		this.logger.ifTrace(() => `Offset set to: ${offset}`);
		const oldLimit: number = this.limit;
		const oldOffset: number = this.offset;

		this.limit = limit;
		this.offset = isDefined(offset) ? offset : 0;

		if (!equals(DEFAULT_EQUALS_DEPTH, oldLimit, this.limit) || !equals(DEFAULT_EQUALS_DEPTH, oldOffset, this.offset)) {
			this.limiting.invalidate();
			this.limiting.refresh();
		}
	}

	public items(): unknown[] {
		return this.limiting.items();
	}

	public extend(): FilterBuilder {
		return this.limiting.extend();
	}

	public addCallback(thisObject: Object, callback: () => void): void {
		this.limiting.addCallback(thisObject, callback);
	}
}

class PagedFilterImpl implements PagedFilter {
	private parent: FilterImpl;

	private limited: LimitOffsetFilterImpl;

	private page: number;

	private pageSize: number;

	private atBeginning: boolean;

	private atEnd: boolean;

	private moreBefore: boolean;

	private moreAfter: boolean;

	private logger: Logger;

	constructor(parent: Filter) {
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.limited = this.parent.extend().limited() as LimitOffsetFilterImpl;
		this.logger = getLogger(`pagedFilter`);
		this.page = 0;
		this.pageSize = 10;
		this.parent.addCallback(this, () => {
			this.enforcePageBounds();
			this.sync();
		});
		this.sync();
	}

	public getPageSize(): number {
		return this.pageSize;
	}

	public setPageSize(size: number): void {
		this.logger.ifTrace(() => `Page size set to: ${size}`);
		this.pageSize = size < 1 ? 1 : Math.floor(size);
		this.sync();
	}

	public getTotalPages(): number {
		return Math.ceil(this.parent.items().length / this.pageSize);
	}

	public getPage(): number {
		return this.page;
	}

	public setPage(page: number): void {
		this.logger.ifTrace(() => `Page set to: ${page}`);
		this.page = Math.floor(page);
		this.enforcePageBounds();

		this.sync();
	}

	public toPrevious(): void {
		this.setPage(this.page - 1);
	}

	public toNext(): void {
		this.setPage(this.page + 1);
	}

	public toStart(): void {
		this.setPage(0);
	}

	public toEnd(): void {
		this.setPage(this.getTotalPages());
	}

	public items(): unknown[] {
		return this.limited.items();
	}

	public extend(): FilterBuilder {
		return this.limited.extend();
	}

	public addCallback(thisObject: Object, callback: () => void): void {
		this.limited.addCallback(thisObject, callback);
	}

	public enforcePageBounds(): void {
		if (this.page < 0) {
			this.page = 0;
		}

		if (this.page >= this.getTotalPages()) {
			this.page = this.getTotalPages() - 1;
		}

		if (this.page < 0) {
			this.page = 0;
		}

		this.logger.ifTrace(() => `Page normalized to: ${this.page}`);
	}

	public isAtBeginning(): boolean {
		return this.atBeginning;
	}

	public isAtEnd(): boolean {
		return this.atEnd;
	}

	public isMoreBefore(): boolean {
		return this.moreBefore;
	}

	public isMoreAfter(): boolean {
		return this.moreAfter;
	}

	private sync(): void {
		this.atBeginning = this.page === 0;
		this.atEnd = this.page >= this.getTotalPages() - 1;
		this.moreBefore = !this.atBeginning;
		this.moreAfter = !this.atEnd;
		this.limited.setLimitAndOffset(this.pageSize, this.page * this.pageSize);
	}
}

export default FilterBuilderImpl;
