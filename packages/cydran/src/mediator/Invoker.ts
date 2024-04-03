import { Supplier } from "interface/Predicate";
import ScopeImpl from "scope/ScopeImpl";
import { requireNotNull } from 'util/Utils';

class Invoker {

	private scope: ScopeImpl;

	private utilities: any;

	constructor(scope: ScopeImpl, utilities: any = {}) {
		this.scope = requireNotNull(scope, "logger");
		this.utilities = requireNotNull(utilities, "utilities");
	}

	public invoke(expression: string, params: any = {}): void {
		const code: string = `
			'use strict';
			(function(m, v, s, u, p) {
				(${expression});
			})(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
		`;

		const mFn: Supplier<any> = this.scope.getMFn();
		const vFn: Supplier<any> = this.scope.getVFn();
		const sFn: Supplier<any> = () => this.scope.getItemsCopy();
		const uFn: Supplier<any> = () => this.utilities;
		const pFn: () => any = () => params;

		Function(code).apply({}, [mFn, vFn, sFn, uFn, pFn]);
	}

}

export default Invoker;