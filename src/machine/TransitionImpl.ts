import { requireNotNull, isDefined } from "util/Utils";
import { VarConsumer, VarPredicate } from "interface/Predicate";
import MachineState from "machine/MachineState";
import Transition from "machine/Transition";
import { ValidationError } from "error/Errors";
import Addable from "interface/ables/Addable";

class TransitionImpl<M> implements Transition<M> {

	private targetState: string;

	private predicate: VarPredicate<any, M>;

	private callbacks: VarConsumer<any, M>[];

	constructor(targetState: string, callbacks: VarConsumer<any, M>[], predicate?: VarPredicate<any, M>) {
		this.targetState = requireNotNull(targetState, "targetState");
		this.predicate = isDefined(predicate) ? predicate : (model: M) => true;
		this.callbacks = requireNotNull(callbacks, "callbacks");
	}

	public execute(state: MachineState<M>, parameter: any): boolean {
		const result: boolean = this.predicate.apply(state.getModel(), [parameter, state.getModel()]);

		if (result) {
			for (const callback of this.callbacks) {
				callback.apply(state.getModel(), [parameter, state.getModel()]);
			}
		}

		return result;
	}

	public getTargetState(): string {
		return this.targetState;
	}

	public validate(stateNames: string[], errors: Addable<string>): void {
		let idFound: boolean = false;

		for (const id of stateNames) {
			if (this.targetState === id) {
				idFound = true;
				break;
			}
		}

		if (!idFound) {
			throw new ValidationError(`State ${this.targetState} is not a valid state id`);
		}
	}

	public $dispose(): void {
		this.predicate = null;
	}

}

export default TransitionImpl;
