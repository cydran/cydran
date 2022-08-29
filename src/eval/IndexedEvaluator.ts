import Logger from "log/Logger";
import Scope from "scope/Scope";
import ScopeImpl from "scope/ScopeImpl";

import { asIdentity } from "util/AsFunctions";
import { isDefined } from "util/Utils";

class IndexedEvaluator<T> {

	private expression: string;

	private logger: Logger;

	private code: string;

	private reducerFn: (input: any) => T;

	private scope: ScopeImpl;

	constructor(expression: string, scope: Scope, reducerFn: (input: any) => T, logr: Logger) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.logger = logr;
		this.expression = expression;
		this.scope = scope as ScopeImpl;
		this.code = `
			'use strict';
			return (function(v, $index, p, s) {
				return (${this.expression});
			})(arguments[0], arguments[1], arguments[2], arguments[3]);
		`;
	}

	public test(subject: any, index: number, values: (() => any)[]): T {
		let value: T = null;
		const subjectFn: () => any = () => subject;
		const valueFn: (index: number) => any = (i) => values[i]();
		const scopeFn: () => any = () => this.scope.getItemsCopy();

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
