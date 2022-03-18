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
		this.code = `'use strict'; ${this.scope.getCode()} var v = arguments[1]; var $index = arguments[2]; var p = arguments[3]; return (${this.expression});`;
	}

	public test(subject: any, index: number, values: (() => any)[]): T {
		let value: T = null;
		const subjectFn: () => any = () => subject;
		const valueFn: (index: number) => any = (i) => values[i]();

		try {
			value = Function(this.code).apply({}, [
				this.scope.getItems(),
				subjectFn,
				index,
				valueFn
			]);
		} catch (e) {
			this.logger.ifError(() => `(${ e.name }) thrown invoking behavior expression: ${ this.expression }\n\nContext:\n${ this.code }\nMessage: ${ e.message }`, e);
		}

		const result = this.reducerFn(value);

		return result;
	}
}

export default IndexedEvaluator;
