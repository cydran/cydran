interface Watchable {

	onExpressionChange<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void;

	/**
	 * Evaluates an expression.
	 * @param expression Expression to evaluate.
	 */
	evaluate<T>(expression: string): T;

	getWatchContext(): any;

}

export default Watchable;
