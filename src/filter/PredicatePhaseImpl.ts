import AbstractPhaseImpl from "@/filter/AbstractPhaseImpl";
import Phase from "@/filter/Phase";

class PredicatePhaseImpl extends AbstractPhaseImpl {

	constructor(previous: Phase) {
		super(previous);
	}

	protected execute(items: any[]): any[] {
		const result: any[] = [];

		// tslint:disable-next-line:prefer-for-of
		for (let i = 0; i < items.length; i++) {
			const current: any = items[i];

			if (current["title"] && current["title"].indexOf("blah") !== -1) {
				result.push(current);
			}
		}

		return result;
	}

}

export default PredicatePhaseImpl;
