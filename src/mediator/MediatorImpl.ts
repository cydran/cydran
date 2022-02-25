import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import ScopeImpl from "scope/ScopeImpl";
import Mediator from "mediator/Mediator";
import Getter from "mediator/Getter";
import Setter from "mediator/Setter";
import { isDefined, requireNotNull } from "util/Utils";
import { asIdentity } from "util/AsFunctions";
import Machine from "machine/Machine";
import MediatorStates from "mediator/MediatorStates";
import stateMachineBuilder from "machine/StateMachineBuilder";
import MediatorTransitions from "mediator/MediatorTransitions";
import MachineContext from "machine/MachineContext";

class MediatorImpl<T> implements Mediator<T> {

	private logger: Logger;

	private expression: string;

	private previous: T;

	private watchPrevious: T;

	private watchCurrent: T;

	private watchDispatchPending: boolean;

	private scope: ScopeImpl;

	private watchContext: any;

	private target: (previous: T, current: T) => void;

	private getter: Getter<T>;

	private setter: Setter<T>;

	private reducerFn: (input: any) => T;

	private cloneFn: (input: any) => any;

	private equalsFn: (first: any, second: any) => boolean;

	private machineContext: MachineContext<MediatorImpl<T>>;

	private digestActive: boolean;

	constructor(expression: string, scope: ScopeImpl, reducerFn: (input: any) => T, cloneFn: (input: any) => any,
		equalsFn: (first: any, second: any) => boolean) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope, "scope");
		this.logger = LoggerFactory.getLogger(`${new.target.name}: ${expression}`);
		this.previous = null;
		this.digestActive = false;
		this.watchContext = {};
		this.target = null;
		this.getter = new Getter(expression);
		this.setter = new Setter(expression);
		this.cloneFn = requireNotNull(cloneFn, "cloneFn");
		this.equalsFn = requireNotNull(equalsFn, "equalsFn");
		this.machineContext = MEDIATOR_MACHINE.create(this);
	}

	public tell(name: string, payload?: any): void {
		(MEDIATOR_MACHINE as unknown as Machine<MediatorImpl<T>>).evaluate(name, this.machineContext, payload);
	}

	public get(): T {
		const value: any = this.getter.get(this.scope);
		const reduced: any = this.reducerFn.apply({}, [value]);

		return reduced;
	}

	public set(value: T): void {
		this.setter.set(this.scope, value);
	}

	public evaluate(): boolean {
		let changed: boolean = false;

		if (this.digestActive && isDefined(this.target)) {
			const value: T = this.get();

			if (!this.equalsFn(this.previous, value)) {
				this.logger.ifTrace(() => ({ current: value, previous: this.previous }));
				this.logger.ifTrace(() => "Invoking listener");
				this.swap(value);
				changed = true;
			}
		}

		return changed;
	}

	public notify(): void {
		if (this.watchDispatchPending) {
			this.target.apply(this.watchContext, [this.watchPrevious, this.watchCurrent]);
			this.watchDispatchPending = false;
		}
	}

	public watch(watchContext: any, target: (previous: T, current: T) => void): void {
		this.watchContext = requireNotNull(watchContext, "watchContext");
		this.target = requireNotNull(target, "target");
	}

	public getExpression(): string {
		return this.expression;
	}

	public initialize(): void {
		// TODO - Implement
	}

	public mount(): void {
		this.populate();
		this.digestActive = true;
	}

	public unmount(): void {
		this.digestActive = false;
	}

	public remount(): void {
		this.digestActive = true;
	}

	public $dispose(): void {
		this.previous = null;
		this.watchContext = null;
		this.target = null;
		this.watchPrevious = null;
		this.watchCurrent = null;
		this.watchDispatchPending = false;
	}

	private populate(): void {
		const value: T = this.get();
		const cloned: T = this.cloneFn(value);
		this.watchCurrent = cloned;
		this.watchPrevious = cloned;
		this.previous = cloned;
	}

	private swap(value: T): void {
		const newPrevious: T = this.cloneFn(value);
		this.watchPrevious = this.previous;
		this.watchCurrent = value;
		this.watchDispatchPending = true;
		this.previous = newPrevious;
	}

}

const MEDIATOR_MACHINE: Machine<MediatorImpl<any>> =
	stateMachineBuilder<MediatorImpl<any>>(MediatorStates.UNINITIALIZED)
	.withState(MediatorStates.UNINITIALIZED, [])
	.withState(MediatorStates.READY, [])
	.withState(MediatorStates.MOUNTED, [])
	.withState(MediatorStates.UNMOUNTED, [])
	.withState(MediatorStates.DISPOSED, [])
	.withTransition(MediatorStates.UNINITIALIZED, MediatorTransitions.INIT, MediatorStates.READY, [MediatorImpl.prototype.initialize])
	.withTransition(MediatorStates.READY, MediatorTransitions.DISPOSE, MediatorStates.DISPOSED, [MediatorImpl.prototype.$dispose])
	.withTransition(MediatorStates.READY, MediatorTransitions.MOUNT, MediatorStates.MOUNTED, [MediatorImpl.prototype.mount])
	.withTransition(MediatorStates.MOUNTED, MediatorTransitions.UNMOUNT, MediatorStates.UNMOUNTED, [MediatorImpl.prototype.unmount])
	.withTransition(MediatorStates.UNMOUNTED, MediatorTransitions.MOUNT, MediatorStates.MOUNTED, [MediatorImpl.prototype.remount])
	.withTransition(MediatorStates.UNMOUNTED, MediatorTransitions.DISPOSE, MediatorStates.DISPOSED, [MediatorImpl.prototype.$dispose])
	.build();

export default MediatorImpl;
