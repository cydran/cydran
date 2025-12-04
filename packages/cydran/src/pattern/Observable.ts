import { CallBackThisObject } from "CydranTypes";

interface Observable {

	notify(...payload: unknown[]): void;

	register(thisObject: CallBackThisObject, callback: (...payload: unknown[]) => void, predicate?: (...payload: unknown[]) => boolean, mapper?: (key: string, value: unknown) => unknown): void;

	unregister(thisObject: CallBackThisObject, callback: (...payload: unknown[]) => void): void;

}

export default Observable;
