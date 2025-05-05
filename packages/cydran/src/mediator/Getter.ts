import { Supplier } from "interface/Predicate";
import Logger from "log/Logger";
import ScopeImpl from "scope/ScopeImpl";
import { requireNotNull } from "util/Utils";

class Getter<T> {

	private expression: string;

	private code: string;

	private logger: Logger;

	constructor(expression: string, logger: Logger) {
		this.logger = logger;
		this.expression = requireNotNull(expression, "expression");
		this.code = `
			'use strict';
			return (function(m, v, s, u) {
				return (${this.expression});
			})(arguments[0], arguments[1], arguments[2], arguments[3]);
		`;
	}

	public get(scope: ScopeImpl): T {
		requireNotNull(scope, "scope");
		let value: T = null;

		const mFn: Supplier<unknown> = scope.getMFn();
		const vFn: Supplier<unknown> = scope.getVFn();
		const sFn: Supplier<unknown> = () => scope.getItemsCopy();
		const uFn: Supplier<unknown> = () => ({});

		try {
			value = Function(this.code).apply({}, [mFn, vFn, sFn, uFn]);
		} catch (e) {
			this.logger.ifError(() => `\n(${e.name}) thrown invoking behavior expression: ${this.expression}\n\nCode:\n${this.code}\nMessage: ${e.message}`, e);
		}

		return value;
	}

}

export default Getter;
