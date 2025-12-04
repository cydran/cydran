import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import { requireNotNull } from "util/Utils";

class DelegatingPhaseImpl extends AbstractPhaseImpl {

	private fn: (input: unknown[]) => unknown[];

	constructor(previous: Phase, fn: (input: unknown[]) => unknown[]) {
		super("Delegating", previous);
		this.fn = requireNotNull(fn, "fn");
	}

	protected execute(items: unknown[]): unknown[] {
		return this.fn.apply({}, [items]);
	}

}

export default DelegatingPhaseImpl;
