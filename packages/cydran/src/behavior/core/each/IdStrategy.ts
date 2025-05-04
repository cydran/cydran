interface IdStrategy {

	check(item: unknown): boolean;

	enrich(item: unknown, index: number): void;

	extract(item: unknown): string;

	init(): void;

}

export default IdStrategy;
