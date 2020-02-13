import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ScopeImpl from "@/model/ScopeImpl";

interface ScopeMap {

	[name: string]: any;

}

class Invoker {

	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.expression = expression;
		this.logger = LoggerFactory.getLogger("Invoker: " + expression);
	}

	public invoke(scope: ScopeImpl, params: any): void {
		const aggregateScope: ScopeMap = {};
		const scopeItems: ScopeMap = scope.getItems();

		for (const key in scopeItems) {
			if (scopeItems.hasOwnProperty(key)) {
				aggregateScope[key] = scopeItems[key];
			}
		}

		if (params !== null && params !== undefined) {
			for (const key in params) {
				if (params.hasOwnProperty(key)) {
					aggregateScope[key] = params[key];
				}
			}
		}

		let aggregateScopeCode: string = "";

		for (const key in aggregateScope) {
			if (aggregateScope.hasOwnProperty(key)) {
				const statement: string = "var " + key + " = arguments[0]['" + key + "'];\n";
				aggregateScopeCode += statement;
			}
		}

		const code: string = '"use strict"; ' + aggregateScopeCode + " (" + this.expression + ");";

		try {
			Function(code).apply({}, [aggregateScope]);
		} catch (e) {
			this.logInvocationError(code, e);
		}
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the element mediator expression: " + this.expression
			 + "\n\nIn context:\n" + code + "\n\nException message: " + e.message + "\n\n", e);
	}

}

export default Invoker;
