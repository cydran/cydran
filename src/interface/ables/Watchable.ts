interface Watchable {

	onExpressionChange<T>(expression: string, callback: (previous: T, current: T) => void, reducerFn?: (input: any) => T, targetThis?: any): void;

	/**
	 * Evaluates an expression.
	 * @param expression Expression to evaluate.
	 */
	evaluate<T>(expression: string): T;

	getWatchScope(): any;

}

export default Watchable;
