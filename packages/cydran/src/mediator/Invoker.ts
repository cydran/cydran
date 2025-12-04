import { Supplier } from "interface/Predicate";
import ScopeImpl from "scope/ScopeImpl";
import { defaulted, requireNotNull } from 'util/Utils';

class Invoker {

	private scope: ScopeImpl;

	private utilities: unknown;

	constructor(scope: ScopeImpl, utilities?: unknown) {
		this.scope = requireNotNull(scope, "logger");
		this.utilities = defaulted(utilities, {});
	}

	public invoke(expression: string, params: unknown): void {
		requireNotNull(expression, "expression");

		const actualParams: unknown = defaulted(params, {});

		const code: string = `
			'use strict';
			(function(m, v, s, u, p) {
				(${expression});
			})(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		`;

		const mFn: Supplier<unknown> = this.scope.getMFn();
		const vFn: Supplier<unknown> = this.scope.getVFn();
		const sFn: Supplier<unknown> = () => this.scope.getItemsCopy();
		const uFn: Supplier<unknown> = () => this.utilities;
		const pFn: () => unknown = () => actualParams;

		Function(code).apply({}, [mFn, vFn, sFn, uFn, pFn]);
	}

}

export default Invoker;