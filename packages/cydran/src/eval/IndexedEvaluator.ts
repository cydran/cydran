import Logger from "log/Logger";
import Scope from "scope/Scope";
import ScopeImpl from "scope/ScopeImpl";

import { asIdentity } from "util/AsFunctions";
import { isDefined, requireNotNull } from "util/Utils";

class IndexedEvaluator<T> {

	private expression: string;

	private logger: Logger;

	private code: string;

	private reducerFn: (input: unknown) => T;

	private scope: ScopeImpl;

	constructor(expression: string, scope: Scope, reducerFn: (input: unknown) => T, logger: Logger) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity as (input: unknown) => T;
		this.logger = logger;
		this.expression = requireNotNull(expression, "expression");
		this.scope = requireNotNull(scope as ScopeImpl, "scope");
		this.code = `
			'use strict';
			return (function(v, $index, p, s) {
				return (${this.expression});
			})(arguments[0], arguments[1], arguments[2], arguments[3]);
		`;
	}

	public test(subject: unknown, index: number, values: (() => unknown)[]): T {
		let value: T = null;
		const subjectFn: () => unknown = () => subject;
		const valueFn: (index: number) => unknown = (i) => values[i]();
		const scopeFn: () => unknown = () => this.scope.getItemsCopy();

		try {
			value = Function(this.code).apply({}, [subjectFn, index, valueFn, scopeFn]);
		} catch (e) {
			this.logger.ifError(() => `(${e.name}) thrown invoking behavior expression: ${this.expression}\n\nCode:\n${this.code}\nMessage: ${e.message}`, e);
		}

		const result = this.reducerFn(value);

		return result;
	}
}

export default IndexedEvaluator;
