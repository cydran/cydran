import Disposable from "interface/ables/Disposable";
import DigestionCandidate from "digest/DigestionCandidate";

interface ModelMediator<T> extends Disposable, DigestionCandidate {
	invoke(params?: any): void;

	get(): T;

	set(value: any): void;

	watch(context: any, target: (previous: T, current: T) => void): void;

	populate(): void;
}

export default ModelMediator;