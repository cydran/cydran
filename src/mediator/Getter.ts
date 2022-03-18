import Logger from "log/Logger";
import ScopeImpl from "scope/ScopeImpl";

class Getter<T> {

	private expression: string;

	private logger: Logger;

	constructor(expression: string, logr: Logger) {
		this.logger = logr;
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
		this.logger.ifError(() => `\n(${ e.name }) thrown invoking behavior expression: ${ this.expression }\n\nContext:\n${ code }\nMessage: ${ e.message }`, e);
	}
}

export default Getter;
