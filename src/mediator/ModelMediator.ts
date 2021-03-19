import DigestionCandidate from "@/digest/DigestionCandidate";
import Disposable from "@/interface/ables/Disposable";

interface ModelMediator<T> extends Disposable, DigestionCandidate {

	invoke(params?: any): void;

	get(): T;

	set(value: any): void;

	watch(context: any, target: (previous: T, current: T) => void): void;

	populate(): void;

}

export default ModelMediator;