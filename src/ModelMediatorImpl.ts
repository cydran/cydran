import _ from "lodash";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import ModelMediator from "./ModelMediator";

class ModelMediatorImpl implements ModelMediator {

	private logger: Logger;

	private model: any;

	private expression: string;

	private previous: any;

	private value: any;

	private filterCode: string;

	private filters: any;

	private context: any;

	private target: (previous: any, current: any) => void;

	constructor(model: any, expression: string, filterCode: string, filters: any) {
		this.logger = LoggerFactory.getLogger("ModelMediator: " + expression);
		this.model = model;
		this.expression = expression;
		this.filterCode = filterCode;
		this.filters = filters;
		this.previous = null;
		this.value = null;
		this.context = {};
		this.target = null;
	}

	public invoke(...args: any[]): void {
		const code: string = '"use strict"; (' + this.expression + ");";
		Function(code).apply(this.model, args);
	}

	public get<T>(): T {
		const code: string = '"use strict"; ' + this.filterCode + " return (" + this.expression + ");";
		this.value = Function(code).apply(this.model, [this.filters]);

		return this.value;
	}

	public set(value: any): void {
		const code: string = '"use strict"; ' + this.expression + "= arguments[0];";
		this.value = value;

		Function(code).apply(this.model, [value]);
	}

	public digest(): boolean {
		if (!this.target) {
			return false;
		}

		// Check for opts out of digestion

		this.get();

		let changed: boolean = false;

		if (!_.isEqual(this.previous, this.value)) {
			if (this.logger.isTrace()) {
				this.logger.trace({
					current: this.value,
					previous: this.previous
				});
			}

			this.logger.trace("Invoking listener");
			this.target.apply(this.context, [this.previous, this.value]);

			this.previous = _.cloneDeep(this.value);
			changed = true;
		} else {
			this.logger.trace("Not different.");
		}

		return changed;
	}

	public watch(context: any, target: (previous: any, current: any) => void): void {
		this.context = context;
		this.target = target;
	}

	public dispose(): void {
		this.model = null;
		this.previous = null;
		this.value = null;
		this.context = null;
		this.target = null;
	}

	protected getExpression(): string {
		return this.expression;
	}

}

export default ModelMediatorImpl;
