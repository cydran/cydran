import IdStrategy from "@/element/repeat/IdStrategy";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";

class ExpressionIdStrategyImpl implements IdStrategy {

	private logger: Logger;

	private code: string;

	private expression: string;

	private fn: Function;

	constructor(expression: string) {
		this.logger = LoggerFactory.getLogger("Id Function: " + expression);
		this.expression = expression;
		this.code = '"use strict"; return function(i,item,v,value) { return ' + expression + ' }(arguments[0], arguments[0], arguments[0], arguments[0]);';
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
			this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the id function expression: " + this.expression
			 + "\n\nIn context:\n" + this.code + "\n\nException message: " + e.message + "\n\n", e);

			 throw e;
		}

		return id;
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default ExpressionIdStrategyImpl;
