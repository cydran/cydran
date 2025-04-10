import { EvaluationError } from "error/Errors";
import ScopeImpl from "scope/ScopeImpl";
import { requireNotNull } from "util/Utils";

class Evaluator {

	private expression: string;

	private scope: ScopeImpl;

	private code: string;

	constructor(expression: string, scope: ScopeImpl) {
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope, "scope");
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
			throw new EvaluationError(`(${e.name}) thrown invoking behavior expression: ${this.expression}\n\nCode:\n${this.code}\nMessage: ${e.message}`);
		}

		return value;
	}
}

export default Evaluator;
