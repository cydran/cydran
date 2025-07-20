import Logger from "log/Logger";
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
import MachineState from "machine/MachineState";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { IdGenerator } from "util/IdGenerator";
import getLogger from "log/getLogger";
import { CallBackThisObject } from "CydranTypes";

type Callback<T> = (previous: T, current: T) => void;

class MediatorImpl<T> implements Mediator<T> {

	private logger: Logger;

	private expression: string;

	private previous: T;

	private watchPrevious: T;

	private watchCurrent: T;

	private watchDispatchPending: boolean;

	private scope: ScopeImpl;

	private callbacks: GarbageCollectablePairedSet<CallBackThisObject, Callback<T>, CallBackThisObject>;

	private getter: Getter<T>;

	private setter: Setter<T>;

	private reducerFn: (input: unknown) => T;

	private cloneFn: (input: T) => T;

	private equalsFn: (first: unknown, second: unknown) => boolean;

	private machineState: MachineState<MediatorImpl<T>>;

	private digestActive: boolean;

	private id: string;

	constructor(expression: string, scope: ScopeImpl,
		reducerFn: (input: unknown) => T, cloneFn: (input: T) => T,
		equalsFn: (first: unknown, second: unknown) => boolean)
		{
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity as (input: unknown) => T;
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope, "scope");
		this.id = IdGenerator.generate();
		this.logger = getLogger(`mediator-${ this.id }`, `Mediator: ${expression}`);
		this.previous = null;
		this.digestActive = false;
		this.callbacks = new GarbageCollectablePairedSetImpl<CallBackThisObject, Callback<T>, CallBackThisObject>();
		this.getter = new Getter(expression, getLogger(`mediator-getter-${ this.id }`, `Getter: ${ expression }`));
		this.setter = new Setter(expression, getLogger(`mediator-setter-${ this.id }`, `Setter: ${ expression }`));
		this.cloneFn = requireNotNull(cloneFn, "cloneFn");
		this.equalsFn = requireNotNull(equalsFn, "equalsFn");
		this.machineState = MEDIATOR_MACHINE.create(this) as MachineState<MediatorImpl<T>>;
	}

	public tell(name: string, payload?: unknown): void {
		(MEDIATOR_MACHINE as unknown as Machine<MediatorImpl<T>>).submit(name, this.machineState, payload);
	}

	public get(): T {
		const value: unknown = this.getter.get(this.scope);
		const reduced: T = this.reducerFn.apply({}, [value]);

		return reduced;
	}

	public set(value: T): void {
		this.setter.set(this.scope, value);
	}

	public evaluate(): boolean {
		let changed: boolean = false;

		if (this.digestActive && this.callbacks.isPopulated()) {
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
			this.callbacks.forEach((thisObject: CallBackThisObject, callback: Callback<T>) => {
				callback.call(thisObject, this.watchPrevious, this.watchCurrent);
			});

			this.watchDispatchPending = false;
		}
	}

	public watch(thisObject: CallBackThisObject, callback: (previous: T, current: T) => void): void {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");

		this.callbacks.add(thisObject, callback);
	}

	public unwatch(thisObject: CallBackThisObject, callback: (previous: T, current: T) => void): void {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");

		this.callbacks.remove(thisObject, callback);
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

	public $release(): void {
		this.previous = null;
		this.callbacks.clear();
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

const MEDIATOR_MACHINE: Machine<MediatorImpl<unknown>> =
	stateMachineBuilder<MediatorImpl<unknown>>(MediatorStates.UNINITIALIZED)
	.withState(MediatorStates.UNINITIALIZED, [])
	.withState(MediatorStates.READY, [])
	.withState(MediatorStates.MOUNTED, [])
	.withState(MediatorStates.UNMOUNTED, [])
	.withState(MediatorStates.DISPOSED, [])
	.withTransition(MediatorStates.UNINITIALIZED, MediatorTransitions.INIT, MediatorStates.READY, [MediatorImpl.prototype.initialize])
	.withTransition(MediatorStates.READY, MediatorTransitions.DISPOSE, MediatorStates.DISPOSED, [MediatorImpl.prototype.$release])
	.withTransition(MediatorStates.READY, MediatorTransitions.MOUNT, MediatorStates.MOUNTED, [MediatorImpl.prototype.mount])
	.withTransition(MediatorStates.MOUNTED, MediatorTransitions.UNMOUNT, MediatorStates.UNMOUNTED, [MediatorImpl.prototype.unmount])
	.withTransition(MediatorStates.UNMOUNTED, MediatorTransitions.MOUNT, MediatorStates.MOUNTED, [MediatorImpl.prototype.remount])
	.withTransition(MediatorStates.UNMOUNTED, MediatorTransitions.DISPOSE, MediatorStates.DISPOSED, [MediatorImpl.prototype.$release])
	.build();

export default MediatorImpl;
