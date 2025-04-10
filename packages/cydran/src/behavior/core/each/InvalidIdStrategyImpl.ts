import IdStrategy from "behavior/core/each/IdStrategy";

class InvalidIdStrategyImpl implements IdStrategy {

	public check(item: any): boolean {
		return true;
	}

	public enrich(item: any, index: number): void {
		// Intentionally do nothing
	}

	public extract(item: any): string {
		return null;
	}

	public init(): void {
		throw new Error('Invalid strategy for "each".  Must be "generated", "none", or "expression".');
	}

}

export default InvalidIdStrategyImpl;
