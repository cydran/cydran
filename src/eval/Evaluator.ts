import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import ScopeImpl from "scope/ScopeImpl";

class Evaluator {
	private expression: string;

	private logger: Logger;

	private scope: ScopeImpl;

	private code: string;

	constructor(expression: string, scope: ScopeImpl) {
		this.logger = LoggerFactory.getLogger(`${new.target.name}: ${expression}`);
		this.expression = expression;
		this.scope = scope;
		this.code = `"use strict"; ${scope.getCode()} return (${this.expression});`;
	}

	public test(): boolean {
		let value: boolean = null;

		try {
			value = !!Function(this.code).apply({}, [this.scope.getItems()]);
		} catch (e) {
			this.logger.error(
				`\nAn error (${e["name"]}) was thrown invoking the behavior expression: ${this.expression}\n\nIn context:\n${this.code}\n\nException message: ${e["message"]}\n\n`,
				e
			);
		}

		return value;
	}
}

export default Evaluator;
