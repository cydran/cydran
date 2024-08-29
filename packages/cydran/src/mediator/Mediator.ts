import DigestionCandidate from "digest/DigestionCandidate";
import Tellable from "interface/ables/Tellable";
import Releasable from "interface/ables/Releasable";

interface Mediator<T> extends Releasable, DigestionCandidate, Tellable {

	get(): T;

	set(value: any): void;

	watch(targetThis: any, callback: (previous: T, current: T) => void): void;

}

export default Mediator;
