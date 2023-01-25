import LoggerFactory from "log/LoggerFactory";

interface Filter {
	/**
	 * Get the resulting array of items after the filter has been applied
	 * @returns array of filtered objects
	 */
	items(): any[];

	/**
	 * Extend a {Filter filter} instance
	 * @returns a {FilterBuilder} object
	 */
	extend(): FilterBuilder;

}

interface FilterBuilder {

	withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withPhase(fn: (input: any[]) => any[]): FilterBuilder;

	withSimplePredicate(predicate: (index: number, value: any) => boolean): FilterBuilder;

	withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withLimit(limit: number): FilterBuilder;

	with(fn: (builder: FilterBuilder) => void): FilterBuilder;

	build(): Filter;

	paged(): PagedFilter;

	limited(): LimitOffsetFilter;

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

	isAtBeginning(): boolean;

	isAtEnd(): boolean;

	isMoreBefore(): boolean;

	isMoreAfter(): boolean;

}

interface LimitOffsetFilter extends Filter {

	getLimit(): number;

	setLimit(limit: number): void;

	getOffset(): number;

	setOffset(offset: number): void;

	setLimitAndOffset(limit: number, offset: number): void;

}

export { Filter, FilterBuilder, LimitOffsetFilter, PagedFilter } ;
