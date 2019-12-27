import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ScopeImpl from "@/ScopeImpl";

class Getter<T> {

	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.expression = expression;
		this.logger = LoggerFactory.getLogger("Getter: " + expression);
	}

	public get(scope: ScopeImpl): T {
		const code: string = '"use strict"; ' + scope.getCode() + " return (" + this.expression + ");";
		let value: any = null;

		try {
			value = Function(code).apply({}, [scope.getItems()]);
		} catch (e) {
			this.logInvocationError(code, e);
		}

		return value;
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the element mediator expression: " + this.expression
			 + "\n\nIn context:\n" + code + "\n\nException message: " + e.message + "\n\n", e);
	}

}

export default Getter;
