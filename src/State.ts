import { requireNotNull, isDefined } from "@/Utils";
import { SimpleMap, Disposable } from '@/Interfaces';
import { UnknownStateError, UnknownInputError, ValidationError } from "@/Errors";

interface MachineContext<M> extends Disposable {

	getState(): string;

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

	private context: any;

	private predicate: (model: M) => boolean;

	constructor(target: string, predicate: (model: M) => boolean, context?: any) {
		this.target = requireNotNull(target, "target");
		this.predicate = requireNotNull(predicate, "predicate");
		this.context = isDefined(context) ? context : {};
	}

	public execute(context: MachineContext<M>): boolean {
		return this.predicate.apply(this.context, [context.getModel()]);
	}

	public getTarget(): string {
		return this.target;
	}

	public $dispose(): void {
		this.predicate = null;
		this.context = null;
	}

}

interface State<M> extends Disposable {

	evaluate(input: string, context: MachineContext<M>): void;

}

class StateImpl<M> implements State<M> {

	private id: string;

	private transitions: SimpleMap<TransitionImpl<M>>;

	constructor(id: string) {
		this.id = requireNotNull(id, "id");
		this.transitions = {};
	}

	public evaluate(input: string, context: MachineContext<M>): void {
		const transition: Transition<M> = this.transitions[input];

		if (!isDefined(transition)) {
			throw new UnknownInputError("Unknown transition: " + input);
		}

		const transitionAllowed: boolean = transition.execute(context);

		if (transitionAllowed) {
			const target: string = transition.getTarget();
			(context as MachineContextImpl<M>).setState(target);
		}
	}

	public withTransition(input: string, target: string, predicate: (model: M) => boolean, context?: any): void {
		this.transitions[input] = new TransitionImpl<M>(target, predicate, context);
	}

	public $dispose(): void {
		for (const key in this.transitions) {
			if (this.transitions.hasOwnProperty(key)) {
				this.transitions[key].$dispose();
			}
		}

		this.transitions = {};
	}

}

interface MachineBuilder<M> {

	withState(state: string): MachineBuilder<M>;

	withTransition(state: string, input: string, target: string, predicate: (model: M) => boolean, context?: any): MachineBuilder<M>;

	build(): Machine<M>;

}

class MachineBuilderImpl<M> implements MachineBuilder<M> {

	private instance: MachineImpl<M>;

	constructor(startState: string) {
		this.instance = new MachineImpl<M>(startState);
	}

	public withState(state: string): MachineBuilder<M> {
		this.instance.withState(state);

		return this;
	}

	public withTransition(state: string, input: string, target: string, predicate: (model: M) => boolean, context?: any): MachineBuilder<M> {
		this.instance.withTransition(state, input, target, predicate, context);

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
		const currentState: State<M> = this.states[state];

		if (!isDefined(currentState)) {
			throw new UnknownStateError("Unknown state: " + state);
		}

		currentState.evaluate(input, context);
	}

	public validate(): void {
		// TODO - Implement
	}

	public withState(id: string): void {
		this.states[id] = new StateImpl<M>(id);
	}

	public withTransition(id: string, input: string, target: string, predicate: (model: M) => boolean, context?: any): void {
		if (!isDefined(this.states[id])) {
			throw new UnknownStateError("Unknown state: " + id);
		}

		this.states[id].withTransition(input, target, predicate, context);
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

function createMachineBuilder<M>(startState: string): MachineBuilder<M> {
	return new MachineBuilderImpl<M>(startState);
}

export {
	MachineContext,
	Machine,
	createMachineBuilder
};