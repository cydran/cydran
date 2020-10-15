import { requireNotNull, isDefined } from "@/Utils";
import { SimpleMap, Disposable, Predicate, Consumer } from '@/Interfaces';
import { UnknownStateError, UnknownInputError, ValidationError } from "@/Errors";

interface MachineContext<M> extends Disposable {

	getState(): string;

	isState(state: string): boolean;

	getModel(): M;

}

class MachineContextImpl<M> implements MachineContext<M> {

	private state: string;

	private model: M;

	constructor(state: string, model: M) {
		this.state = requireNotNull(state, "state");
		this.model = requireNotNull(model, "model");
	}

	public getState(): string {
		return this.state;
	}

	public isState(state: string): boolean {
		return state === this.state;
	}

	public setState(state: string): void {
		this.state = state;
	}

	public getModel(): M {
		return this.model;
	}

	public $dispose(): void {
		this.state = null;
		this.model = null;
	}

}

interface Machine<M> extends Disposable {

	create(model: M): MachineContext<M>;

	evaluate(input: string, context: MachineContext<M>): void;

}

interface Transition<M> extends Disposable {

	execute(context: MachineContext<M>): boolean;

	getTarget(): string;

}

class TransitionImpl<M> implements Transition<M> {

	private target: string;

	private predicate: Predicate<M>;

	private callbacks: Consumer<M>[];

	constructor(target: string, predicate?: Predicate<M>, callbacks?: Consumer<M>[]) {
		this.target = requireNotNull(target, "target");
		this.predicate = isDefined(predicate) ? predicate : (model: M) => true;
		this.callbacks = isDefined(callbacks) ? callbacks : [];
	}

	public execute(context: MachineContext<M>): boolean {
		const result: boolean = this.predicate.apply({}, [context.getModel()]);

		if (result) {
			for (const callback of this.callbacks) {
				callback.apply({}, [context.getModel()]);
			}
		}

		return result;
	}

	public getTarget(): string {
		return this.target;
	}

	public validate(stateNames: string[], errors: string[]): void {
		let idFound: boolean = false;

		for (const id of stateNames) {
			if (this.target === id) {
				idFound = true;
				break;
			}
		}

		if (!idFound) {
			throw new ValidationError(`State ${this.target} is not a valid state id`);
		}
	}

	public $dispose(): void {
		this.predicate = null;
	}

}

interface State<M> extends Disposable {

	evaluate(input: string, context: MachineContext<M>): boolean;

}

class StateImpl<M> implements State<M> {

	private id: string;

	private transitions: SimpleMap<TransitionImpl<M>[]>;

	private callbacks: Consumer<M>[];

	constructor(id: string, callbacks?: Consumer<M>[]) {
		this.id = requireNotNull(id, "id");
		this.transitions = {};
		this.callbacks = isDefined(callbacks) ? callbacks : [];
	}

	public evaluate(input: string, context: MachineContext<M>): boolean {
		const transitions: Transition<M>[] = this.transitions[input];

		if (!isDefined(transitions)) {
			throw new UnknownInputError(`Unknown transition: ${input}`);
		}

		let changed: boolean = false;

		for (const transition of transitions) {
			const transitionAllowed: boolean = transition.execute(context);

			if (transitionAllowed) {
				const target: string = transition.getTarget();
				(context as MachineContextImpl<M>).setState(target);
				changed = true;
				break;
			}
		}

		return changed;
	}

	public enter(model: M): void {
		for (const callback of this.callbacks) {
			callback.apply({}, [model]);
		}
	}

	public withTransition(input: string, target: string, predicate?: Predicate<M>, callbacks?: Consumer<M>[]): void {
		if (!isDefined(this.transitions[input])) {
			this.transitions[input] = [];
		}

		this.transitions[input].push(new TransitionImpl<M>(target, predicate, callbacks));
	}

	public validate(stateNames: string[], errors: string[]): void {
		let idFound: boolean = false;

		for (const id of stateNames) {
			if (this.id === id) {
				idFound = true;
				break;
			}
		}

		if (!idFound) {
			throw new ValidationError(`State ${this.id} is not a valid state id`);
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
					transition.$dispose();
				}
			}
		}

		this.transitions = {};
	}

}

interface MachineBuilder<M> {

	withState(state: string, callbacks?: Consumer<M>[]): MachineBuilder<M>;

	withTransition(state: string, input: string, target: string, predicate?: Predicate<M>, callbacks?: Consumer<M>[]): MachineBuilder<M>;

	build(): Machine<M>;

}

class MachineBuilderImpl<M> implements MachineBuilder<M> {

	private instance: MachineImpl<M>;

	constructor(startState: string) {
		requireNotNull(startState, "startState");
		this.instance = new MachineImpl<M>(startState);
	}

	public withState(state: string, callbacks?: Consumer<M>[]): MachineBuilder<M> {
		this.instance.withState(state, callbacks);

		return this;
	}

	public withTransition(state: string, input: string, target: string, predicate?: Predicate<M>, callbacks?: Consumer<M>[]): MachineBuilder<M> {
		this.instance.withTransition(state, input, target, predicate, callbacks);

		return this;
	}

	public build(): Machine<M> {
		if (!isDefined(this.instance)) {
			throw new ValidationError("No start state set");
		}

		this.instance.validate();

		return this.instance;
	}

}

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

	public evaluate(input: string, context: MachineContext<M>): void {
		const state: string = context.getState();
		const currentState: State<M> = this.states[state] as StateImpl<M>;

		if (!isDefined(currentState)) {
			throw new UnknownStateError(`Unknown state: ${state}`);
		}

		const changed: boolean = currentState.evaluate(input, context);

		if (changed) {
			const afterState: StateImpl<M> = this.states[context.getState()];

			if (!isDefined(currentState)) {
				throw new UnknownStateError(`Unknown state: ${state}`);
			}

			afterState.enter(context.getModel());
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

	public withState(id: string, callbacks?: Consumer<M>[]): void {
		this.states[id] = new StateImpl<M>(id, callbacks);
	}

	public withTransition(id: string, input: string, target: string, predicate?: Predicate<M>, callbacks?: Consumer<M>[]): void {
		if (!isDefined(this.states[id])) {
			throw new UnknownStateError(`Unknown state: ${id}`);
		}

		this.states[id].withTransition(input, target, predicate, callbacks);
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

function stateMachineBuilder<M>(startState: string): MachineBuilder<M> {
	return new MachineBuilderImpl<M>(startState);
}

export {
	MachineContext,
	Machine,
	stateMachineBuilder
};