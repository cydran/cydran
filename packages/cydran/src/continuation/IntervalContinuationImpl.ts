import IntervalContinuation from "continuation/IntervalContinuation";
import { requireNotNull } from 'util/Utils';
import ComponentInternals from 'component/ComponentInternals';

class IntervalContinuationImpl implements IntervalContinuation {

	private internals: ComponentInternals;

	private delay: number;

	constructor(internals: ComponentInternals, delay: number) {
		this.internals = requireNotNull(internals, "internals");
		this.delay = requireNotNull(delay, "delay");
	}

	public invoke(name: string): void {
		this.internals.addInterval(name, this.delay);
	}

}

export default IntervalContinuationImpl;
