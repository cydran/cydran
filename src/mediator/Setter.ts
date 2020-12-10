import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import ScopeImpl from "scope/ScopeImpl";

class Setter<T> {
	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.logger = LoggerFactory.getLogger(`Setter: ${expression}`);
		this.expression = expression;
	}

	public set(scope: ScopeImpl, value: T): void {
		const code: string = `'use strict'; ${scope.getCode()} ${
			this.expression
		} = arguments[1];`;

		try {
			Function(code).apply({}, [scope.getItems(), value]);
		} catch (e) {
			this.logInvocationError(code, e);
		}
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.error(
			`\nAn error (${e.name}) was thrown invoking the behavior expression: ${this.expression}\n\nIn context:\n${code}\n\nException message: ${e.message}\n\n`,
			e
		);
	}
}

export default Setter;
