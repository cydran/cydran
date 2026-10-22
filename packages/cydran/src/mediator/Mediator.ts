import DigestionCandidate from "digest/DigestionCandidate";
import Tellable from "interface/ables/Tellable";
import Releasable from "interface/ables/Releasable";
import { CallBackThisObject } from "CydranTypes";

interface Mediator<T> extends Releasable, DigestionCandidate, Tellable {

	get(): T;

	set(value: unknown): void;

	watch(thisObject: CallBackThisObject, name: string): void;

}

export default Mediator;
