import AbstractPhaseImpl from "@/filter/AbstractPhaseImpl";
import { requireNotNull } from "@/util/ObjectUtils";
import { Phase } from "@/filter/Interfaces";

class SimplePredicatePhaseImpl extends AbstractPhaseImpl {

	private predicate: (index: number, value: any) => boolean;

	constructor(previous: Phase, predicate: (index: number, value: any) => boolean) {
		super(previous);
		this.predicate = requireNotNull(predicate, "predicate");
	}

	protected execute(items: any[]): any[] {
		const result: any[] = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (this.predicate.apply({}, [i, current])) {
				result.push(current);
			}
		}

		return result;
	}

}

export default SimplePredicatePhaseImpl;
