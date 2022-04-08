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
		this.code = `
			'use strict';
			return (function(m, v, s) {
				return (${this.expression});
			})(arguments[0], arguments[1], arguments[2]);
		`;
	}

	public test(): boolean {
		let value: boolean = null;
		const mFn: () => any = this.scope.getMFn();
		const vFn: () => any = this.scope.getVFn();
		const scopeFn: () => any = () => this.scope.getItemsCopy();

		try {
			value = !!Function(this.code).apply({}, [mFn, vFn, scopeFn]);
		} catch (e) {
			this.logger.ifError(() => `(${e.name}) thrown invoking behavior expression: ${this.expression}\n\nContext:\n${this.code}\nMessage: ${e.message}`, e);
		}

		return value;
	}
}

export default Evaluator;
