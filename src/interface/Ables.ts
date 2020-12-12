interface Notifyable {
	notify(): void;
}

interface Evaluatable {
	evaluate(): boolean;
}

interface Tellable {
	tell(name: string, payload?: any): void;
}

interface Messagable {
	message(channelName: string, messageName: string, payload?: any): void;
}

interface Watchable {
	watch<T>(
		expression: string,
		target: (previous: T, current: T) => void,
		reducerFn?: (input: any) => T,
		context?: any
	): void;

	evaluate<T>(expression: string): T;

	getWatchContext(): any;
}

interface Disposable {
	$dispose(): void;
}

interface Digestable {
	$apply(fn: Function, args: any[]): any;
}

interface Gettable {
	get<T>(id: string): T;
}

export {
	Digestable,
	Disposable,
	Evaluatable,
	Gettable,
	Messagable,
	Tellable,
	Watchable,
	Notifyable
};
