import IdStrategy from "behavior/core/each/IdStrategy";
import Logger from "log/Logger";

class ExpressionIdStrategyImpl implements IdStrategy {

	private logger: Logger;

	private code: string;

	private expression: string;

	private fn: Function;

	constructor(expression: string, logger: Logger) {
		this.logger = logger;
		this.expression = expression;
		this.code = `'use strict'; return function(i,item,v,value) { return ${ expression } }(arguments[0], arguments[0], arguments[0], arguments[0]);`;
		this.fn = Function(this.code);
	}

	public check(item: unknown): boolean {
		return false;
	}

	public enrich(item: unknown, index: number): void {
		// Intentionally do nothing
	}

	public extract(item: unknown): string {
		let id: string = null;

		try {
			const itemFn: () => unknown = () => item;
			id = this.fn.apply({}, [itemFn]);
		} catch (e) {
			this.logger.ifError(() => `(${ e.name }) thrown invoking id function: ${ this.expression }\n\nCode:\n${ this.code }\nMessage: ${ e.message }`, e);

			throw e;
		}

		return id;
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default ExpressionIdStrategyImpl;
