import Disposable from "./Disposable";

interface ModelMediator<T> extends Disposable {

	invoke(...args: any[]): void;

	get(): T;

	set(value: any): void;

	evaluate(guard: string): boolean;

	watch(context: any, target: (previous: T, current: T, guard?: string) => void): void;

	notifyWatcher(guard: string): void;

	setReducer(reducerFn: (input: T) => any): void;

}

export default ModelMediator;
