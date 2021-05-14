import Phase from "phase/Phase";
import AbstractPhaseImpl from "phase/AbstractPhaseImpl";
import { requireNotNull } from "util/Utils";

class DelegatingPhaseImpl extends AbstractPhaseImpl {
	private fn: (input: any[]) => any[];

	constructor(previous: Phase, fn: (input: any[]) => any[]) {
		super("Delegating Phase", previous);
		this.fn = requireNotNull(fn, "fn");
	}

	protected execute(items: any[]): any[] {
		return this.fn.apply({}, [items]);
	}
}

export default DelegatingPhaseImpl;
