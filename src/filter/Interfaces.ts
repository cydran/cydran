import Supplier from "@/pattern/Supplier";

interface Filter {

	items(): any[];

	extend(): FilterBuilder;

}

interface LimitOffsetFilter  extends Filter {

	getLimit(): number;

	setLimit(limit: number): void;

	getOffset(): number;

	setOffset(offset: number): void;

	setLimitAndOffset(limit: number, offset: number): void;

}

interface PagedFilter extends Filter {

	getPageSize(): number;

	setPageSize(size: number): void;

	getTotalPages(): number;

	getPage(): number;

	setPage(page: number): void;

	toPrevious(): void;

	toNext(): void;

	toStart(): void;

	toEnd(): void;

}

interface FilterBuilder {

	withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withSimplePredicate(predicate: (index: number, value: any) => boolean): FilterBuilder;

	withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withLimit(limit: number): FilterBuilder;

	with(fn: (builder: FilterBuilder) => void): FilterBuilder;

	build(): Filter;

	paged(): PagedFilter;

	limited(): LimitOffsetFilter;

}

interface Phase {

	process(items: any[]): any[];

	invalidate(): void;

	setCallback(callback: () => void): void;

}

interface Watcher<T> extends Supplier<T> {

	addCallback(context: any, callback: () => void): Watcher<T>;

}

interface Callback {
	context: any;
	fn: () => void;
}

export { Callback, Filter, FilterBuilder, LimitOffsetFilter, PagedFilter, Phase, Watcher };
