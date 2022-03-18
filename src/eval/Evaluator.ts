import Logger from "log/Logger";
import ScopeImpl from "scope/ScopeImpl";

class Evaluator {
	private expression: string;

	private logger: Logger;

	private scope: ScopeImpl;

	private code: string;

	constructor(expression: string, scope: ScopeImpl, logr: Logger) {
		this.logger = logr;
		this.expression = expression;
		this.scope = scope;
		this.code = `"use strict"; ${scope.getCode()} return (${this.expression});`;
	}

	public test(): boolean {
		let value: boolean = null;

		try {
			value = !!Function(this.code).apply({}, [this.scope.getItems()]);
		} catch (e) {
			this.logger.ifError(() => `(${ e.name }) thrown invoking behavior expression: ${ this.expression }\n\nContext:\n${ this.code }\nMessage: ${ e.message }`, e);
		}

		return value;
	}
}

export default Evaluator;
