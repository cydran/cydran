interface IdStrategy {

	check(item: any): boolean;

	enrich(item: any, index: number): void;

	extract(item: any): string;

	init(): void;

}

export default IdStrategy;