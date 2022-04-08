import Logger from "log/Logger";
import Scope from "scope/Scope";
import ScopeImpl from "scope/ScopeImpl";

class ComparisonEvaluator {

	private expression: string;

	private logger: Logger;

	private code: string;

	private scope: ScopeImpl;

	constructor(expression: string, scope: Scope, logr: Logger) {
		this.logger = logr;
		this.expression = expression;
		this.scope = scope as ScopeImpl;
		this.code = `
			'use strict';
			return (function(a, b, p, s) {
				return (${this.expression});
			})(arguments[0], arguments[1], arguments[2], arguments[3]);
		`;
	}

	public compare(first: any, second: any, values: (() => any)[]): number {
		let result: number = 0;
		const valueFn: (index: number) => any = (i) => values[i]();
		const scopeFn: () => any = () => this.scope.getItemsCopy();

		try {
			result = Function(this.code).apply({}, [first, second, valueFn, scopeFn]);
		} catch (e) {
			this.logger.ifError(() => `(${e.name}) thrown invoking behavior expression: ${this.expression}\n\nContext:\n${this.code}\nMessage: ${e.message}`, e);
		}

		return result;
	}

}

export default ComparisonEvaluator;
