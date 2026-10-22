import WatchContinuation from "continuation/WatchContinuation";
import ComponentInternals from "component/ComponentInternals";
import { requireNotNull } from "util/Utils";
import { CallBackThisObject } from "CydranTypes";

class WatchContinuationImpl implements WatchContinuation {

	private internals: ComponentInternals;

	private component: CallBackThisObject;

	private expression: string;

	private reducerFn?: (input: unknown) => unknown;

	constructor(internals: ComponentInternals, component: CallBackThisObject, expression: string) {
		this.internals = requireNotNull(internals, "internals");
		this.component = requireNotNull(component, "component");
		this.expression = requireNotNull(expression, "expression");
	}

	public reducedBy<T>(reducerFn: (input: unknown) => T): WatchContinuation {
		this.reducerFn = requireNotNull(reducerFn, "reducerFn");

		return this;
	}

	public invoke(name: string): void {
		this.internals.watch(this.expression, this.component, name, this.reducerFn);
	}

}

export default WatchContinuationImpl;
