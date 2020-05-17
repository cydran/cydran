import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import { asIdentity } from "@/model/Reducers";
import ObjectUtils from "@/util/ObjectUtils";

const isDefined = ObjectUtils.isDefined;

class IndexedEvaluator<T> {

	private expression: string;

	private logger: Logger;

	private code: string;

	private reducerFn: (input: any) => T;

	constructor(expression: string, reducerFn: (input: any) => T) {
		this.reducerFn = isDefined(reducerFn) ? reducerFn : asIdentity;
		this.logger = LoggerFactory.getLogger("Evaluator: " + expression);
		this.expression = expression;
		this.code = '"use strict"; var v = args[0]; var p = args[1]; return (' + this.expression + ');";';
	}

	public test(subject: any, values: any[]): T {
		let value: T = null;
		const subjectFn: () => any = () => subject;
		const valueFn: (index: number) => any = (i) => values[i];

		try {
			value = Function(this.code).apply({}, [subjectFn, valueFn]);
		} catch (e) {
			this.logger.error("\nAn exception (" + e.name + ") was thrown invoking the element mediator expression: "
				+ this.expression + "\n\nIn context:\n" + this.code + "\n\nException message: " + e.message + "\n\n", e);
		}

		const result = this.reducerFn(value);

		return result;
	}

}

export default IndexedEvaluator;
