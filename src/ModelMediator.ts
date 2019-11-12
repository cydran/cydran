import Disposable from "./Disposable";

interface ModelMediator extends Disposable {

	invoke(...args: any[]): void;

	get<T>(): T;

	set(value: any): void;

	evaluate(guard: string): boolean;

	watch(context: any, target: (previous: any, current: any, guard?: string) => void): void;

	notifyWatcher(guard: string): void;

	setReducer(reducerFn: (input: any) => any): void;

}

export default ModelMediator;
