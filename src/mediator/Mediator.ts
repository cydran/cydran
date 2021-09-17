import Disposable from "interface/ables/Disposable";
import DigestionCandidate from "digest/DigestionCandidate";
import Tellable from "interface/ables/Tellable";

interface Mediator<T> extends Disposable, DigestionCandidate, Tellable {

	invoke(params?: any): void;

	get(): T;

	set(value: any): void;

	watch(context: any, target: (previous: T, current: T) => void): void;

}

export default Mediator;
