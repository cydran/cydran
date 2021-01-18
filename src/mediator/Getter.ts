import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import ScopeImpl from "scope/ScopeImpl";

class Getter<T> {
	private expression: string;

	private logger: Logger;

	constructor(expression: string) {
		this.logger = LoggerFactory.getLogger(`Getter: ${expression}`);
		this.expression = expression;
	}

	public get(scope: ScopeImpl): T {
		const code: string = `'use strict'; ${scope.getCode()} return (${this.expression});`;
		let value: any = null;

		try {
			value = Function(code).apply({}, [scope.getItems()]);
		} catch (e) {
			this.logInvocationError(code, e);
		}

		return value;
	}

	private logInvocationError(code: string, e: Error) {
		this.logger.ifWarn(
			() =>
				`\nAn exception (${e.name}) was thrown invoking the element mediator expression: ${this.expression}\n\nIn context:\n${code}\n\nException message: ${e.message}\n\n`,
			e
		);
	}
}

export default Getter;