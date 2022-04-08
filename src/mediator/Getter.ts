import { Supplier } from "interface/Predicate";
import Logger from "log/Logger";
import ScopeImpl from "scope/ScopeImpl";

class Getter<T> {

	private expression: string;

	private code: string;

	private logger: Logger;

	constructor(expression: string, logger: Logger) {
		this.logger = logger;
		this.expression = expression;
		this.code = `
			'use strict';
			return (function(m, v, s, u) {
				return (${this.expression});
			})(arguments[0], arguments[1], arguments[2], arguments[3]);
		`;
	}

	public get(scope: ScopeImpl): T {
		let value: any = null;

		const mFn: Supplier<any> = scope.getMFn();
		const vFn: Supplier<any> = scope.getVFn();
		const sFn: Supplier<any> = () => scope.getItemsCopy();
		const uFn: Supplier<any> = () => ({});

		try {
			value = Function(this.code).apply({}, [mFn, vFn, sFn, uFn]);
		} catch (e) {
			this.logger.ifError(() => `\n(${e.name}) thrown invoking behavior expression: ${this.expression}\n\nContext:\n${this.code}\nMessage: ${e.message}`, e);
		}

		return value;
	}

}

export default Getter;
