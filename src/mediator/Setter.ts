import { Supplier } from "interface/Predicate";
import Logger from "log/Logger";
import ScopeImpl from "scope/ScopeImpl";

class Setter<T> {

	private expression: string;

	private code: string;

	private logger: Logger;

	constructor(expression: string, logger: Logger) {
		this.logger = logger;
		this.expression = expression;
		this.code = `
			'use strict';
			(function(m, v, s, u, $value) {
				${this.expression} = $value;
			})(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		`;
	}

	public set(scope: ScopeImpl, value: T): void {
		const mFn: Supplier<any> = scope.getMFn();
		const vFn: Supplier<any> = scope.getVFn();
		const sFn: Supplier<any> = () => scope.getItemsCopy();
		const uFn: Supplier<any> = () => ({});

		try {
			Function(this.code).apply({}, [mFn, vFn, sFn, uFn, value]);
		} catch (e) {
			this.logger.ifError(() => `\n(${e.name}) thrown invoking behavior expression: ${this.expression}\n\nContext:\n${this.code}\nMessage: ${e.message}`, e);
		}
	}

}

export default Setter;
