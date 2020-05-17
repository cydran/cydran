import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import { asIdentity } from "@/model/Reducers";
import { isDefined } from "@/util/ObjectUtils";
import Scope from "@/model/Scope";
import ScopeImpl from "@/model/ScopeImpl";

class IndexedEvaluator<T> {

	private expression: string;

	private logger: Logger;

	private code: string;

	private reducerFn: (input: any) => T;

	private scope: ScopeImpl;

	constructor(expression: string, scope: Scope, reducerFn: (input: any) => T) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.logger = LoggerFactory.getLogger("Evaluator: " + expression);
		this.expression = expression;
		this.scope = scope as ScopeImpl;
		this.code = '"use strict"; ' + this.scope.getCode() + ' var v = arguments[1]; var index = arguments[2]; var p = arguments[3]; return (' + this.expression + ');';
	}

	public test(subject: any, index: number, values: (() => any)[]): T {
		let value: T = null;
		const subjectFn: () => any = () => subject;
		const valueFn: (index: number) => any = (i) => values[i]();

		try {
			value = Function(this.code).apply({}, [this.scope.getItems(), subjectFn, index, valueFn]);
		} catch (e) {
			this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the element mediator expression: "
				+ this.expression + "\n\nIn context:\n" + this.code + "\n\nException message: " + e.message + "\n\n", e);
		}

		const result = this.reducerFn(value);

		return result;
	}

}

export default IndexedEvaluator;
