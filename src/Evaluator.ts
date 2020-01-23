import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ScopeImpl from "@/ScopeImpl";

class Evaluator {

	private expression: string;

	private logger: Logger;

	private scope: ScopeImpl;

	private code: string;

	constructor(expression: string, scope: ScopeImpl) {
		this.logger = LoggerFactory.getLogger("Evaluator: " + expression);
		this.expression = expression;
		this.scope = scope;
		this.code = '"use strict"; ' + scope.getCode() + " return (" + this.expression + ");";
	}

	public test(): boolean {
		let value: boolean = null;

		try {
			value = !!Function(this.code).apply({}, [this.scope.getItems()]);
		} catch (e) {
			this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the element mediator expression: "
				+ this.expression + "\n\nIn context:\n" + this.code + "\n\nException message: " + e.message + "\n\n", e);
		}

		return value;
	}

}

export default Evaluator;
