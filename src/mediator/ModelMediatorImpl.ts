import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import ScopeImpl from "scope/ScopeImpl";
import ModelMediator from "mediator/ModelMediator";
import Invoker from "mediator/Invoker";
import Getter from "mediator/Getter";
import Setter from "mediator/Setter";
import { isDefined, requireNotNull } from "util/Utils";
import { asIdentity } from "util/AsFunctions";

class ModelMediatorImpl<T> implements ModelMediator<T> {
	private logger: Logger;

	private model: any;

	private expression: string;

	private previous: T;

	private watchPrevious: T;

	private watchCurrent: T;

	private watchDispatchPending: boolean;

	private scope: ScopeImpl;

	private context: any;

	private digested: boolean = false;

	private target: (previous: T, current: T) => void;

	private invoker: Invoker;

	private getter: Getter<T>;

	private setter: Setter<T>;

	private reducerFn: (input: any) => T;

	private cloneFn: (input: any) => any;

	private equalsFn: (first: any, second: any) => boolean;

	constructor(
		model: any,
		expression: string,
		scope: ScopeImpl,
		reducerFn: (input: any) => T,
		cloneFn: (input: any) => any,
		equalsFn: (first: any, second: any) => boolean
	) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.model = requireNotNull(model, "model");
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope, "scope");
		this.logger = LoggerFactory.getLogger(`ModelMediator: ${expression}`);
		this.previous = null;
		this.context = {};
		this.target = null;
		this.invoker = new Invoker(expression);
		this.getter = new Getter(expression);
		this.setter = new Setter(expression);
		this.cloneFn = requireNotNull(cloneFn, "cloneFn");
		this.equalsFn = requireNotNull(equalsFn, "equalsFn");
	}

	public invoke(params?: any): void {
		this.invoker.invoke(this.scope, params || {});
	}

	public get(): T {
		return this.reducerFn.apply({}, [this.getter.get(this.scope)]);
	}

	public set(value: T): void {
		this.setter.set(this.scope, value);
	}

	public evaluate(): boolean {
		if (!this.target) {
			return false;
		}

		let changed: boolean = false;
		const value: T = this.get();

		if (this.digested) {
			if (this.equalsFn(this.previous, value)) {
				this.logger.ifTrace(() => ({ message: "Not different.", value: value }));
			} else {
				if (this.logger.isTrace()) {
					this.logger.trace({ current: value, previous: this.previous });
				}

				this.logger.trace("Invoking listener");
				this.swap(value);
				changed = true;
			}
		} else {
			this.swap(value);
			changed = true;
			this.digested = true;
		}

		return changed;
	}

	public notify(): void {
		if (this.watchDispatchPending) {
			this.target.apply(this.context, [this.watchPrevious, this.watchCurrent]);
			this.watchDispatchPending = false;
		}
	}

	public watch(context: any, target: (previous: T, current: T) => void): void {
		this.context = requireNotNull(context, "context");
		this.target = requireNotNull(target, "target");
	}

	public $dispose(): void {
		this.model = null;
		this.previous = null;
		this.context = null;
		this.target = null;
		this.watchPrevious = null;
		this.watchCurrent = null;
		this.watchDispatchPending = false;
	}

	public getExpression(): string {
		return this.expression;
	}

	public populate(): void {
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

export default ModelMediatorImpl;
