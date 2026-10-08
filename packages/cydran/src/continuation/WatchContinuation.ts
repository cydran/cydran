interface WatchContinuation {

	reducedBy<T>(reducerFn: (input: unknown) => T): WatchContinuation;

	invoke(name: string): void;

}

export default WatchContinuation;
