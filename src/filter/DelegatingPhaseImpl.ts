import Phase from "filter/Phase";
import AbstractPhaseImpl from "filter/AbstractPhaseImpl";
import { requireNotNull } from "util/Utils";
import LoggerFactory from "log/LoggerFactory";

class DelegatingPhaseImpl extends AbstractPhaseImpl {

	private fn: (input: any[]) => any[];

	constructor(previous: Phase, fn: (input: any[]) => any[], logFactory: LoggerFactory) {
		super("Delegating", previous, logFactory);
		this.fn = requireNotNull(fn, "fn");
	}

	protected execute(items: any[]): any[] {
		return this.fn.apply({}, [items]);
	}

}

export default DelegatingPhaseImpl;
