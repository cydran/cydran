import Supplier from "@/pattern/Supplier";

interface Filter {

	items(): any[];

	extend(): FilterBuilder;

}

interface FilterBuilder {

	withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withLimit(limit: number): FilterBuilder;

	build(): Filter;

	with(fn: (builder: FilterBuilder) => void);

}

interface Phase {

	process(items: any[]): any[];

	setCallback(callback: () => void): void;

}

interface Watcher<T> extends Supplier<T> {

	addCallback(context: any, callback: () => void): Watcher<T>;

}

interface Callback {
	context: any;
	fn: () => void;
}

export { Callback, Filter, FilterBuilder, Phase, Watcher };
