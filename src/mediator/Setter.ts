import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import ScopeImpl from "scope/ScopeImpl";

class Setter<T> {
	private expression: string;

	private logger: Logger;

	constructor(expression: string, logr: Logger) {
		this.logger = logr;
		this.expression = expression;
	}

	public set(scope: ScopeImpl, value: T): void {
		const code: string = `'use strict'; ${scope.getCode()} ${
			this.expression
		} = arguments[1];`;

		try {
			Function(code).apply({}, [scope.getItems(), value]);
		} catch (e) {
			this.logger.ifError(() => `\n(${ e.name }) thrown invoking behavior expression: ${ this.expression }\n\nContext:\n${ code }\nMessage: ${ e.message }`, e);
		}
	}

}

export default Setter;
