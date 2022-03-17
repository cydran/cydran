import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import { requireNotNull } from "util/Utils";
import LoggerFactory from "log/LoggerFactory";

class SimplePredicatePhaseImpl extends AbstractPhaseImpl {
	private predicate: (index: number, value: any) => boolean;

	constructor(previous: Phase, predicate: (index: number, value: any) => boolean, logFactory: LoggerFactory) {
		super(`SimplePredicate`, previous, logFactory);
		this.predicate = requireNotNull(predicate, "predicate");
	}

	protected execute(items: any[]): any[] {
		const result: any[] = [];

		this.getLogger().ifTrace(() => this.loggerPayload("Before predicate filtration", items));

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (this.predicate.apply({}, [i, current])) {
				result.push(current);
			}
		}

		this.getLogger().ifTrace(() => this.loggerPayload("After predicate filtration", result));

		return result;
	}
}

export default SimplePredicatePhaseImpl;
