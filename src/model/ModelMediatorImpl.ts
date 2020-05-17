import Getter from "@/model/Getter";
import Invoker from "@/model/Invoker";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ModelMediator from "@/model/ModelMediator";
import ScopeImpl from "@/model/ScopeImpl";
import Setter from "@/model/Setter";
import Mvvm from "@/mvvm/Mvvm";
import { asIdentity } from "@/model/Reducers";
import { isDefined, requireNotNull, equals, clone } from "@/util/ObjectUtils";

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

	private mvvm: Mvvm;

	private reducerFn: (input: any) => T;

	constructor(model: any, expression: string, scope: ScopeImpl, mvvm: Mvvm, reducerFn: (input: any) => T) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.model = requireNotNull(model, "model");
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope, "scope");
		this.mvvm = requireNotNull(mvvm, "mvvm");
		this.logger = LoggerFactory.getLogger("ModelMediator: " + expression);
		this.previous = null;
		this.context = {};
		this.target = null;
		this.watchDispatchPending = false;
		this.invoker = new Invoker(expression);
		this.getter = new Getter(expression);
		this.setter = new Setter(expression);
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
			if (equals(this.previous, value)) {
				this.logger.trace("Not different.");
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
			this.mvvm.getParent().importExternals();
			this.target.apply(this.context, [this.watchPrevious, this.watchCurrent]);
			this.mvvm.getParent().exportExternals();
			this.watchDispatchPending = false;
		}
	}

	public watch(context: any, target: (previous: T, current: T) => void): void {
		this.context = requireNotNull(context, "context");
		this.target = requireNotNull(target, "target");
	}

	public dispose(): void {
		this.model = null;
		this.mvvm = null;
		this.previous = null;
		this.context = null;
		this.target = null;
		this.watchPrevious = null;
		this.watchCurrent = null;
		this.watchDispatchPending = false;
	}

	protected getExpression(): string {
		return this.expression;
	}

	private swap(value: T): void {
		const newPrevious: T = clone(value);
		this.watchPrevious = this.previous;
		this.watchCurrent = value;
		this.watchDispatchPending = true;
		this.previous = newPrevious;
	}

}

export default ModelMediatorImpl;
