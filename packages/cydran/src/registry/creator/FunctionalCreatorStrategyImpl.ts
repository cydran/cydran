import CreatorStrategy from "registry/creator/CreatorStrategy";
import { requireNotNull } from "util/Utils";

class FunctionalCreatorStrategyImpl<T> implements CreatorStrategy<T> {

	private fn: (argumentValues: unknown[]) => T;

	constructor(fn: (argumentValues: unknown[]) => T) {
		this.fn = requireNotNull(fn, "fn");
	}

	public $release(): void {
		this.fn = null;
	}

	public create(): (argumentValues: unknown[]) => T {
		return this.fn;
	}

}

export default FunctionalCreatorStrategyImpl;
