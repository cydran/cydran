import Disposable from "@/pattern/Disposable";
import DigestionCandidate from "@/mvvm/DigestionCandidate";

interface ModelMediator<T> extends Disposable, DigestionCandidate {

	invoke(params?: any): void;

	get(): T;

	set(value: any): void;

	watch(context: any, target: (previous: T, current: T) => void): void;

	setReducer(reducerFn: (input: T) => any): void;

}

export default ModelMediator;
