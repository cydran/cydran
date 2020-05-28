import Watchable from "@/model/Watchable";
import { FilterBuilder, Watcher, Phase, Callback, Filter, PagedFilter, LimitOffsetFilter } from "@/filter/Interfaces";
import { requireNotNull, isDefined } from "@/util/ObjectUtils";
import WatcherImpl from "@/filter/WatcherImpl";
import Supplier from "@/pattern/Supplier";
import SortPhaseImpl from "@/filter/SortPhaseImpl";
import PredicatePhaseImpl from "@/filter/PredicatePhaseImpl";
import IdentityPhaseImpl from "@/filter/IdentityPhaseImpl";
import SimplePredicatePhaseImpl from "@/filter/SimplePredicatePhaseImpl";

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

	public withSimplePredicate(predicate: (index: number, value: any) => boolean): FilterBuilder {
		this.phase = new SimplePredicatePhaseImpl(this.phase, predicate);

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
		return this.withSimplePredicate((index:number, value: any) => index < limit);
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

class FilterImpl implements Filter, Watcher<any[]> {

	private filteredItems: any[];

	private watchable: Watchable;

	private watcher: Supplier<any[]>;

	private phase: Phase;

	private callbacks: Callback[];

	constructor(watchable: Watchable, watcher: Watcher<any[]>, phase: Phase) {
		this.filteredItems = [];
		this.phase = phase;
		this.watchable = requireNotNull(watchable, "watchable");
		this.watcher = requireNotNull(watcher, "watcher").addCallback(this, () => this.refresh());
		this.callbacks = [];
		this.phase.setCallback(() => this.refresh());
	}

	public items(): any[] {
		return this.filteredItems;
	}

	public extend(): FilterBuilder {
		return new FilterBuilderImpl(this.watchable, this);
	}

	public get(): any[] {
		return this.items();
	}

	public addCallback(context: any, callback: () => void): Watcher<any[]> {
		requireNotNull(context, "context");
		requireNotNull(callback, "callback");

		this.callbacks.push({
			context: context,
			fn: callback
		});

		return this;
	}

	public invalidate(): void {
		this.phase.invalidate();
	}

	private filter(items: any[]): any[] {
		const source: any[] = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i: number = 0; i < items.length; i++) {
			source.push(items[i]);
		}

		return this.phase.process(source);
	}

	public refresh(): void {
		const result: any[] = this.filter(this.watcher.get());

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

	constructor(parent: Filter) {
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.limiting = this.parent.extend()
			.withSimplePredicate(
				(index: number, value: any) => (!isDefined(this.limit) || index < (this.offset + this.limit)) && (index >= this.offset)
			)
			.build() as FilterImpl;
		this.offset = 0;
		this.limit = null;
	}

	public getLimit(): number {
		return this.limit;
	}

	public setLimit(limit: number): void {
		this.limit = isDefined(limit) ? Math.floor(limit) : null;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public getOffset(): number {
		return this.offset;
	}

	public setOffset(offset: number): void {
		this.offset = isDefined(offset) ? Math.floor(offset) : 0;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public setLimitAndOffset(limit: number, offset: number): void {
		this.limit = limit;
		this.offset = isDefined(offset) ? offset : 0;
		this.limiting.invalidate();
		this.limiting.refresh();
	}

	public items(): any[] {
		return this.limiting.items();
	}

	public extend(): FilterBuilder {
		return this.limiting.extend();
	}

	public addCallback(context: any, callback: () => void): void {
		this.limiting.addCallback(context, callback);
	}

}

class PagedFilterImpl implements PagedFilter {

	private parent: FilterImpl;

	private limited: LimitOffsetFilterImpl;

	private page: number;

	private pageSize: number;

	constructor(parent: Filter) {
		this.parent = requireNotNull(parent, "parent") as FilterImpl;
		this.limited = this.parent.extend().limited() as LimitOffsetFilterImpl;
		this.page = 0;
		this.pageSize = 10;
		this.limited.addCallback(this, () => this.enforcePageBounds());
		this.sync();
	}

	public getPageSize(): number {
		return this.pageSize;
	}

	public setPageSize(size: number): void {
		this.pageSize = (size < 1) ? 1 : Math.floor(size);
		this.sync();
	}

	public getTotalPages(): number {
		return Math.ceil(this.parent.items().length / this.pageSize);
	}

	public getPage(): number {
		return this.page;
	}

	public setPage(page: number): void {
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

	public items(): any[] {
		return this.limited.items();
	}

	public extend(): FilterBuilder {
		return this.limited.extend();
	}

	public addCallback(context: any, callback: () => void): void {
		this.limited.addCallback(context, callback);
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
	}

	private sync(): void {
		this.limited.setLimitAndOffset(this.pageSize, this.page * this.pageSize);
	}

}

class Filters {

	public static builder(watchable: Watchable, expression: string): FilterBuilder {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		const watcher: Watcher<any[]> = new WatcherImpl<any[]>(watchable, expression);
		return new FilterBuilderImpl(watchable, watcher);
	}

}

export default Filters;
