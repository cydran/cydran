import Disposable from "@/Disposable";
import Guard from "@/Guard";

interface ModelMediator<T> extends Disposable {

	invoke(...args: any[]): void;

	get(): T;

	set(value: any): void;

	evaluate(guard: Guard): boolean;

	watch(context: any, target: (previous: T, current: T, guard?: Guard) => void): void;

	onDigest(context: any, target: (guard: Guard) => void): void;

	notifyWatcher(guard: Guard): void;

	setReducer(reducerFn: (input: T) => any): void;

}

export default ModelMediator;
