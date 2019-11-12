import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import ModelMediator from "./ModelMediator";
import ObjectUtils from "./ObjectUtils";

const DEFAULT_REDUCER: (input: any) => any = (input) => input;

class ModelMediatorImpl implements ModelMediator {

	private logger: Logger;

	private model: any;

	private expression: string;

	private previous: any;

	private previousFragment: any;

	private watchPrevious: any;

	private watchCurrent: any;

	private watchDispatchPending: boolean;

	private filterCode: string;

	private filters: any;

	private context: any;

	private digested: boolean = false;

	private target: (previous: any, current: any, guard: string) => void;

	private reducerFn: (input: any) => any;

	constructor(model: any, expression: string, filterCode: string, filters: any) {
		this.logger = LoggerFactory.getLogger("ModelMediator: " + expression);
		this.model = model;
		this.expression = expression;
		this.filterCode = filterCode;
		this.filters = filters;
		this.previous = null;
		this.context = {};
		this.target = null;
		this.watchDispatchPending = false;
		this.reducerFn = DEFAULT_REDUCER;
	}

	public invoke(...args: any[]): void {
		const code: string = '"use strict"; (' + this.expression + ");";

		try {
			Function(code).apply(this.model, args);
		} catch (e) {
			this.logInvocationError(code, e);
		}
	}

	public get<T>(): T {
		const code: string = '"use strict"; ' + this.filterCode + " return (" + this.expression + ");";

		let value: any = null;

		try {
			value = Function(code).apply(this.model, [this.filters]);
		} catch (e) {
			this.logInvocationError(code, e);
		}

		return value;
	}

	public set(value: any): void {
		const code: string = '"use strict"; ' + this.expression + "= arguments[0];";

		try {
			Function(code).apply(this.model, [value]);
		} catch (e) {
			this.logInvocationError(code, e);
		}
	}

	public evaluate(guard: string): boolean {
		if (!this.target) {
			return false;
		}

		// Check for opts out of digestion
		let changed: boolean = false;
		const value: any = this.get();
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

	public notifyWatcher(guard: string): void {
		if (this.watchDispatchPending) {
			this.target.apply(this.context, [this.watchPrevious, this.watchCurrent, guard]);
			this.watchDispatchPending = false;
		}
	}

	public watch(context: any, target: (previous: any, current: any, guard: string) => void): void {
		this.context = context;
		this.target = target;
	}

	public dispose(): void {
		this.model = null;
		this.previous = null;
		this.context = null;
		this.target = null;
		this.watchPrevious = null;
		this.watchCurrent = null;
		this.watchDispatchPending = false;
	}

	public setReducer(reducerFn: (input: any) => any): void {
		this.reducerFn = (reducerFn === null) ? DEFAULT_REDUCER : reducerFn;
	}

	protected getExpression(): string {
		return this.expression;
	}

	private swap(value: any, valueFragment: any): void {
		const newPrevious: any = ObjectUtils.clone(value);
		const newPreviousFragment: any = ObjectUtils.clone(valueFragment);
		this.watchPrevious = this.previous;
		this.watchCurrent = value;
		this.watchDispatchPending = true;
		this.previous = newPrevious;
		this.previousFragment = newPreviousFragment;
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the decorator expression: " + this.expression
			 + "\n\nIn context:\n" + code + "\n\nException message: " + e.message + "\n\n", e);
	}

}

export default ModelMediatorImpl;
