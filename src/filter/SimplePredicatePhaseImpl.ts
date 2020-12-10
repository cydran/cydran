import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import { requireNotNull } from "util/Utils";

class SimplePredicatePhaseImpl extends AbstractPhaseImpl {
	private predicate: (index: number, value: any) => boolean;

	constructor(previous: Phase, predicate: (index: number, value: any) => boolean) {
		super("SimplePredicatePhaseImpl", previous);
		this.predicate = requireNotNull(predicate, "predicate");
	}

	protected execute(items: any[]): any[] {
		const result: any[] = [];

		this.getLogger().ifTrace(() => ({
			message: "Before predicate filtration",
			items: items
		}));

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (this.predicate.apply({}, [i, current])) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => ({
			message: "After predicate filtration",
			items: result
		}));

		return result;
	}
}

export default SimplePredicatePhaseImpl;
