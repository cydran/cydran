import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import Scope from "scope/Scope";
import ScopeImpl from "scope/ScopeImpl";

class ComparisonEvaluator {
	private expression: string;

	private logger: Logger;

	private code: string;

	private scope: ScopeImpl;

	constructor(expression: string, scope: Scope) {
		this.logger = LoggerFactory.getLogger(`Evaluator: ${expression}`);
		this.expression = expression;
		this.scope = scope as ScopeImpl;
		this.code = `'use strict'; ${this.scope.getCode()} var a = arguments[1]; var b = arguments[2]; var p = arguments[3]; return (${
			this.expression
		});`;
	}

	public compare(first: any, second: any, values: (() => any)[]): number {
		let result: number = 0;
		const firstFn: () => any = () => first;
		const secondFn: () => any = () => second;
		const valueFn: (index: number) => any = (i) => values[i]();

		try {
			result = Function(this.code).apply({}, [
				this.scope.getItems(),
				firstFn,
				secondFn,
				valueFn,
			]);
		} catch (e) {
			this.logger.error(
				`\nAn error (${e["name"]}) was thrown invoking the element mediator expression: ${this.expression}\n\nIn context:\n${this.code}\n\nException message: ${e["message"]}\n\n`,
				e
			);
		}

		return result;
	}
}

export default ComparisonEvaluator;
