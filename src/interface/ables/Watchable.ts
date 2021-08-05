interface Watchable {

	watch<T>( expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any ): void;

	evaluate<T>(expression: string): T;

	getWatchContext(): any;

}

export default Watchable;
