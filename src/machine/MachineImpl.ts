import MachineContextImpl from "machine/MachineContextImpl";
import SimpleMap from "interface/SimpleMap";
import StateImpl from "machine/StateImpl";

import { requireNotNull, isDefined } from "util/Utils";
import { VarPredicate, VarConsumer } from "interface/Predicate";

import { UnknownStateError, ValidationError } from "error/Errors";
import MachineContext from "machine/MachineContext";
import State from "machine/State";
import Machine from "machine/Machine";

class MachineImpl<M> implements Machine<M> {
	private startState: string;

	private states: SimpleMap<StateImpl<M>>;

	constructor(startState: string) {
		this.startState = requireNotNull(startState, "startState");
		this.states = {};
	}

	public create(model: M): MachineContext<M> {
		return new MachineContextImpl(this.startState, model);
	}

	public evaluate(input: string, context: MachineContext<M>, parameter?: any): void {
		const state: string = context.getState();
		const currentState: State<M> = this.states[state] as StateImpl<M>;

		if (!isDefined(currentState)) {
			throw new UnknownStateError(`Unknown state: ${state}`);
		}

		const changed: boolean = currentState.evaluate(input, context, parameter);

		if (changed) {
			const afterState: StateImpl<M> = this.states[context.getState()];

			if (!isDefined(currentState)) {
				throw new UnknownStateError(`Unknown state: ${state}`);
			}

			afterState.enter(context.getModel(), parameter);
		}
	}

	public validate(): void {
		const errors: string[] = [];

		if (!this.states.hasOwnProperty(this.startState)) {
			errors.push(`Start state is not a validate state: ${this.startState}`);
		}

		const stateNames: string[] = [];

		for (const key in this.states) {
			if (this.states.hasOwnProperty(key)) {
				stateNames.push(key);
			}
		}

		for (const key in this.states) {
			if (this.states.hasOwnProperty(key)) {
				const currentState: StateImpl<M> = this.states[key];
				currentState.validate(stateNames, errors);
			}
		}

		if (errors.length > 0) {
			let joinedErrors: string = "" + errors[0];

			while (errors.length > 0) {
				const error: string = errors.pop();

				if (isDefined(error)) {
					joinedErrors += ", ";
					joinedErrors += error;
				}
			}

			throw new ValidationError(`Machine definition is invalid: ${joinedErrors}`);
		}
	}

	public withState(id: string, callbacks: VarConsumer<any, M>[]): void {
		this.states[id] = new StateImpl<M>(id, callbacks);
	}

	public withTransition(
		id: string,
		input: string,
		target: string,
		callbacks: VarConsumer<any, M>[],
		predicate?: VarPredicate<any, M>
	): void {
		if (!isDefined(this.states[id])) {
			throw new UnknownStateError(`Unknown state: ${id}`);
		}

		this.states[id].withTransition(input, target, callbacks, predicate);
	}

	public $dispose(): void {
		for (const key in this.states) {
			if (this.states.hasOwnProperty(key)) {
				this.states[key].$dispose();
			}
		}

		this.states = {};
	}
}

export default MachineImpl;
