import CreatorStrategy from "registry/creator/CreatorStrategy";
import { requireNotNull } from "util/Utils";

class FunctionalCreatorStrategyImpl<T> implements CreatorStrategy<T> {

	private fn: (argumentValues: any[]) => T;

	constructor(fn: (argumentValues: any[]) => T) {
		this.fn = requireNotNull(fn, "fn");
	}

	public $release(): void {
		this.fn = null;
	}

	public create(): (argumentValues: any[]) => T {
		return this.fn;
	}

}

export default FunctionalCreatorStrategyImpl;
