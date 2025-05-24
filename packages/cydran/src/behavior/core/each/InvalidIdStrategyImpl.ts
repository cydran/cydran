import IdStrategy from "behavior/core/each/IdStrategy";

class InvalidIdStrategyImpl implements IdStrategy {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public check(item: unknown): boolean {
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public enrich(item: unknown, index: number): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public extract(item: unknown): string {
		return null;
	}

	public init(): void {
		throw new Error('Invalid strategy for "each".  Must be "generated", "none", or "expression".');
	}

}

export default InvalidIdStrategyImpl;
