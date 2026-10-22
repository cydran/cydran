import { CallBackThisObject } from "CydranTypes";

interface Watchable {

	onExpressionValueChange<T>(expression: string, thisObject: CallBackThisObject, name: string, reducerFn?: (input: unknown) => T): void;

	/**
	 * Evaluates an expression.
	 * @param expression Expression to evaluate.
	 */
	evaluate<T>(expression: string): T;

	getWatchScope(): unknown;

}

export default Watchable;
