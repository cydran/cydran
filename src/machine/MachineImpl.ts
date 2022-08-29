import MachineStateImpl from "machine/MachineStateImpl";
import SimpleMap from "interface/SimpleMap";
import StateImpl from "machine/StateImpl";

import { requireNotNull, isDefined, safeCydranDisposal } from "util/Utils";
import { VarPredicate, VarConsumer } from "interface/Predicate";

import { UnknownStateError, ValidationError } from "error/Errors";
import MachineState from "machine/MachineState";
import State from "machine/State";
import Machine from "machine/Machine";
import Messages from "util/Messages";

class MachineImpl<M> implements Machine<M> {
	private startState: string;

	private states: SimpleMap<StateImpl<M>>;

	constructor(startState: string) {
		this.startState = requireNotNull(startState, "startState");
		this.states = {};
	}

	public create(model: M): MachineState<M> {
		return new MachineStateImpl(this.startState, model);
	}

	public evaluate(input: string, machineState: MachineState<M>, parameter?: any): void {
		const state: string = machineState.getState();
		const currentState: State<M> = this.states[state] as StateImpl<M>;

		if (!isDefined(currentState)) {
			throw new UnknownStateError(`Unknown state: ${ state }`);
		}

		const changed: boolean = currentState.evaluate(input, machineState, parameter);

		if (changed) {
			const afterState: StateImpl<M> = this.states[machineState.getState()];

			if (!isDefined(afterState)) {
				throw new UnknownStateError(`Unknown state: ${ state }`);
			}

			afterState.enter(machineState.getModel(), parameter);
		}
	}

	public validate(): void {
		const errors: Messages = new Messages("Machine definition is invalid");
		errors.addIf(!this.states.hasOwnProperty(this.startState), () => `Start state is not a validate state: ${ this.startState }`);

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

		errors.ifMessages((message) => {
			throw new ValidationError(message);
		});
	}

	public withState(id: string, callbacks: VarConsumer<any, M>[]): void {
		this.states[id] = new StateImpl<M>(id, callbacks);
	}

	public withTransition(id: string, input: string, targetState: string, callbacks: VarConsumer<any, M>[], predicate?: VarPredicate<any, M>): void {
		if (!isDefined(this.states[id])) {
			throw new UnknownStateError(`Unknown state: ${ id }`);
		}

		this.states[id].withTransition(input, targetState, callbacks, predicate);
	}

	public $dispose(): void {
		for (const key in this.states) {
			if (this.states.hasOwnProperty(key)) {
				safeCydranDisposal(this.states[key]);
			}
		}

		this.states = {};
	}
}

export default MachineImpl;
