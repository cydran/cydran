interface Observable {

	notify(...payload: unknown[]): void;

	register(thisObject: Object, callback: (...payload: unknown[]) => void, predicate?: (...payload: unknown[]) => boolean, mapper?: (key: string, value: unknown) => unknown): void;

	unregister(thisObject: Object, callback: (...payload: unknown[]) => void): void;

}

export default Observable;
