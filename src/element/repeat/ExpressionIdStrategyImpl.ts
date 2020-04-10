import IdStrategy from "@/element/repeat/IdStrategy";
import ObjectUtils from "@/util/ObjectUtils";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";

class ExpressionIdStrategyImpl implements IdStrategy {

	private logger: Logger;

	private idKey: string;

	private code: string;

	private expression: string;

	private fn: Function;

	constructor(idKey: string, expression: string) {
		this.logger = LoggerFactory.getLogger("Id Function: " + expression);
		this.idKey = idKey;
		this.expression = expression;
		this.code = '"use strict"; return function(i) { return ' + expression + ' }(arguments[0]);';
		this.fn = Function(this.code);
	}

	public check(item: any): boolean {
		return ObjectUtils.isDefined(item[this.idKey]);
	}

	public enrich(item: any, index: number): void {
		let id: string = null;

		try {
			const itemFn: () => any = () => item;
			id = this.fn.apply({}, [itemFn]);
			item[this.idKey] = id;
		} catch (e) {
			this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the id function expression: " + this.expression
			 + "\n\nIn context:\n" + this.code + "\n\nException message: " + e.message + "\n\n", e);

			 throw e;
		}
	}

	public extract(item: any): string {
		return item[this.idKey] + "";
	}

	public init(): void {
		// Intentionally do nothing
	}

}

export default ExpressionIdStrategyImpl;
