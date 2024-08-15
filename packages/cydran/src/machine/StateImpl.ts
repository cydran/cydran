import MachineStateImpl from "machine/MachineStateImpl";
import TransitionImpl from "machine/TransitionImpl";
import SimpleMap from "interface/SimpleMap";
import MachineState from "machine/MachineState";
import Transition from "machine/Transition";
import State from "machine/State";

import { requireNotNull, isDefined, safeCydranDisposal } from "util/Utils";
import { VarPredicate, VarConsumer } from "interface/Predicate";
import { ValidationError } from "error/Errors";
import Addable from "interface/ables/Addable";

class StateImpl<M> implements State<M> {

	private id: string;

	private transitions: SimpleMap<TransitionImpl<M>[]>;

	private callbacks: VarConsumer<any, M>[];

	constructor(id: string, callbacks: VarConsumer<any, M>[]) {
		this.id = requireNotNull(id, "id");
		this.transitions = {};
		this.callbacks = requireNotNull(callbacks, "callbacks");
	}

	public evaluate(input: string, machineState: MachineState<M>, parameter: any): boolean {
		const transitions: Transition<M>[] = this.transitions[input];

		let changed: boolean = false;

		if (isDefined(transitions)) {
			for (const transition of transitions) {
				const transitionAllowed: boolean = transition.execute(machineState, parameter);

				if (transitionAllowed) {
					const targetState: string = transition.getTargetState();
					(machineState as MachineStateImpl<M>).setState(targetState);
					changed = true;
					break;
				}
			}
		}

		return changed;
	}

	public enter(model: M, parameter: any): void {
		for (const callback of this.callbacks) {
			callback.apply(model, [parameter, model]);
		}
	}

	public withTransition(input: string, targetState: string, callbacks: VarConsumer<any, M>[], predicate?: VarPredicate<any, M>): void {
		if (!isDefined(this.transitions[input])) {
			this.transitions[input] = [];
		}

		this.transitions[input].push(new TransitionImpl<M>(targetState, callbacks, predicate));
	}

	public validate(stateNames: string[], errors: Addable<string>): void {
		let idFound: boolean = false;

		for (const id of stateNames) {
			if (this.id === id) {
				idFound = true;
				break;
			}
		}

		if (!idFound) {
			throw new ValidationError(`State ${ this.id } is not a valid state id`);
		}

		for (const key in this.transitions) {
			if (this.transitions.hasOwnProperty(key)) {
				const currentTransitions: TransitionImpl<M>[] = this.transitions[key];

				for (const currentTransition of currentTransitions) {
					currentTransition.validate(stateNames, errors);
				}
			}
		}
	}

	public $dispose(): void {
		for (const key in this.transitions) {
			if (this.transitions.hasOwnProperty(key)) {
				const transitions: TransitionImpl<M>[] = this.transitions[key];

				for (const transition of transitions) {
					safeCydranDisposal(transition);
				}
			}
		}

		this.transitions = {};
	}

}

export default StateImpl;
