import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import ScopeImpl from "@/ScopeImpl";

class Invoker {

	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.expression = expression;
		this.logger = LoggerFactory.getLogger("Invoker: " + expression);
	}

	public invoke(scope: ScopeImpl, ...args: any[]): void {
		const code: string = '"use strict"; ' + scope.getCode() + " var args = arguments[1]; (" + this.expression + ");";

		try {
			Function(code).apply({}, [scope.getItems(), args]);
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
