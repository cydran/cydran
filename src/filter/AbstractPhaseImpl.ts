import Phase from "@/filter/Phase";
import { requireNotNull } from "@/util/ObjectUtils";

abstract class AbstractPhaseImpl implements Phase {

	private previous: Phase;

	constructor(previous: Phase) {
		this.previous = requireNotNull(previous, "previous");
	}

	process(items: any[]): any[] {
		const processed: any[] = this.previous.process(items);
		const result: any[] = this.execute(processed);

		return result;
	}

	protected abstract execute(items: any[]): any[];

}

export default AbstractPhaseImpl;
