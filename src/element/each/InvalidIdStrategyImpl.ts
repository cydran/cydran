import IdStrategy from "@/element/repeat/IdStrategy";

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
		throw new Error("Invalid strategy for repeat.  Please see [URL] for further details on properly using the repeat element mediator.");
	}

}

export default InvalidIdStrategyImpl;
