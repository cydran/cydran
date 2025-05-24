import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import { requireNotNull } from "util/Utils";

class SimplePredicatePhaseImpl extends AbstractPhaseImpl {

	private predicate: (index: number, value: unknown) => boolean;

	constructor(previous: Phase, predicate: (index: number, value: unknown) => boolean) {
		super(`SimplePredicate`, previous);
		this.predicate = requireNotNull(predicate, "predicate");
	}

	protected execute(items: unknown[]): unknown[] {
		const result: unknown[] = [];

		this.getLogger().ifTrace(() => this.loggerPayload("Before predicate filtration", items));

		// eslint-disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: unknown = items[i];

			if (this.predicate.apply({}, [i, current])) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => this.loggerPayload("After predicate filtration", result));

		return result;
	}

}

export default SimplePredicatePhaseImpl;
