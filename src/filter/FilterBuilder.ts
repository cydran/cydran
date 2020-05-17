import Filter from "@/filter/Filter";

interface FilterBuilder {

	withPredicate(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	withSort(expression: string, ...parameterExpressions: string[]): FilterBuilder;

	build(): Filter;

}

export default FilterBuilder;
