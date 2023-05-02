import IdStrategy from "behavior/core/each/IdStrategy";
import Logger from "log/Logger";

class ExpressionIdStrategyImpl implements IdStrategy {

	private logger: Logger;

	private code: string;

	private expression: string;

	private fn: Function;

	constructor(expression: string, logr: Logger) {
		this.logger = logr;
		this.expression = expression;
		this.code = `'use strict'; return function(i,item,v,value) { return ${expression} }(arguments[0], arguments[0], arguments[0], arguments[0]);`;
		this.fn = Function(this.code);
	}

	public check(item: any): boolean {
		return false;
	}

	public enrich(item: any, index: number): void {
		// Intentionally do nothing
	}

	public extract(item: any): string {
		let id: string = null;

		try {
			const itemFn: () => any = () => item;
			id = this.fn.apply({}, [itemFn]);
		} catch (e) {
			this.logger.ifError(() => `(${e.name}) thrown invoking id function: ${this.expression}\n\nContext:\n${this.code}\nMessage: ${e.message}`, e);

			throw e;
		}

		return id;
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default ExpressionIdStrategyImpl;
