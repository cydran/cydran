import _ from "lodash";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import ModelMediator from "./ModelMediator";

class ModelMediatorImpl implements ModelMediator {

	private logger: Logger;

	private model: any;

	private expression: string;

	private previous: any;

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
		this.context = {};
		this.target = null;
	}

	public invoke(...args: any[]): void {
		const code: string = '"use strict"; (' + this.expression + ");";
		Function(code).apply(this.model, args);
	}

	public get<T>(): T {
		const code: string = '"use strict"; ' + this.filterCode + " return (" + this.expression + ");";

		return _.cloneDeep(Function(code).apply(this.model, [this.filters]));
	}

	public set(value: any): void {
		const code: string = '"use strict"; ' + this.expression + "= arguments[0];";

		Function(code).apply(this.model, [value]);
	}

	public digest(): boolean {
		if (!this.target) {
			return false;
		}

		// Check for opts out of digestion

		let changed: boolean = false;

		const value: any = this.get();

		if (!_.isEqual(this.previous, value)) {
			if (this.logger.isTrace()) {
				this.logger.trace({
					current: value,
					previous: this.previous,
				});
			}

			this.logger.trace("Invoking listener");

			const newPrevious: any = _.cloneDeep(value);
			this.target.apply(this.context, [this.previous, value]);

			this.previous = newPrevious;
			changed = true;
		} else {
			this.logger.trace("Not different.");
		}

		return changed;
	}

	public watch(context: any, target: (previous: any, current: any) => void): void {
		if (context !== null && target !== null) {
			this.previous = this.get();
		}

		this.context = context;
		this.target = target;
	}

	public dispose(): void {
		this.model = null;
		this.previous = null;
		this.context = null;
		this.target = null;
	}

	protected getExpression(): string {
		return this.expression;
	}

}

export default ModelMediatorImpl;
