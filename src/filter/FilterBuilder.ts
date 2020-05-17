import Filter from "@/filter/Filter";

interface FilterBuilder {

	withPredicate(expression: string): FilterBuilder;

	withSort(expression: string): FilterBuilder;

	build(): Filter;

}

export default FilterBuilder;
