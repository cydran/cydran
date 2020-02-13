import Getter from "@/Getter";
import Invoker from "@/Invoker";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ModelMediator from "@/ModelMediator";
import ObjectUtils from "@/ObjectUtils";
import ScopeImpl from "@/ScopeImpl";
import Setter from "@/Setter";

const requireNotNull = ObjectUtils.requireNotNull;

const DEFAULT_REDUCER: (input: any) => any = (input) => input;

class ModelMediatorImpl<T> implements ModelMediator<T> {

	private logger: Logger;

	private model: any;

	private expression: string;

	private previous: T;

	private previousFragment: any;

	private watchPrevious: T;

	private watchCurrent: T;

	private watchDispatchPending: boolean;

	private scope: ScopeImpl;

	private context: any;

	private digested: boolean = false;

	private target: (previous: T, current: T) => void;

	private digestCallback: () => void;

	private digestCallbackContext: any;

	private reducerFn: (input: T) => any;

	private invoker: Invoker;

	private getter: Getter<T>;

	private setter: Setter<T>;

	constructor(model: any, expression: string, scope: ScopeImpl) {
		this.model = requireNotNull(model, "model");
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope, "scope");
		this.logger = LoggerFactory.getLogger("ModelMediator: " + expression);
		this.previous = null;
		this.context = {};
		this.digestCallbackContext = {};
		this.target = null;
		this.digestCallback = null;
		this.watchDispatchPending = false;
		this.reducerFn = DEFAULT_REDUCER;
		this.invoker = new Invoker(expression);
		this.getter = new Getter(expression);
		this.setter = new Setter(expression);
	}

	public invoke(params?: any): void {
		this.invoker.invoke(this.scope, params || {});
	}

	public get(): T {
		return this.getter.get(this.scope);
	}

	public set(value: T): void {
		this.setter.set(this.scope, value);
	}

	public evaluate(): boolean {
		if (!this.target) {
			return false;
		}

		// Check for opts out of digestion
		let changed: boolean = false;
		const value: T = this.get();
		const valueFragment: any = this.reducerFn(value);

		if (this.digested) {
			if (ObjectUtils.equals(this.previousFragment, valueFragment)) {
				this.logger.trace("Not different.");
			} else {
				if (this.logger.isTrace()) {
					this.logger.trace({ current: value, previous: this.previous });
				}

				this.logger.trace("Invoking listener");
				this.swap(value, valueFragment);
				changed = true;
			}
		} else {
			this.swap(value, valueFragment);
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

	public dispose(): void {
		this.model = null;
		this.previous = null;
		this.context = null;
		this.target = null;
		this.digestCallbackContext = null;
		this.digestCallback = null;
		this.watchPrevious = null;
		this.watchCurrent = null;
		this.watchDispatchPending = false;
	}

	public execute(): void {
		if (this.digestCallback !== null) {
			this.digestCallback.call(this.digestCallbackContext);
		}
	}

	public setReducer(reducerFn: (input: T) => any): void {
		this.reducerFn = (reducerFn === null) ? DEFAULT_REDUCER : reducerFn;
	}

	protected getExpression(): string {
		return this.expression;
	}

	private swap(value: T, valueFragment: any): void {
		const newPrevious: T = ObjectUtils.clone(value);
		const newPreviousFragment: any = ObjectUtils.clone(valueFragment);
		this.watchPrevious = this.previous;
		this.watchCurrent = value;
		this.watchDispatchPending = true;
		this.previous = newPrevious;
		this.previousFragment = newPreviousFragment;
	}

}

export default ModelMediatorImpl;
