import IdStrategy from "behavior/core/each/IdStrategy";

class InvalidIdStrategyImpl implements IdStrategy {

	public check(item: unknown): boolean {
		return true;
	}

	public enrich(item: unknown, index: number): void {
		// Intentionally do nothing
	}

	public extract(item: unknown): string {
		return null;
	}

	public init(): void {
		throw new Error('Invalid strategy for "each".  Must be "generated", "none", or "expression".');
	}

}

export default InvalidIdStrategyImpl;
