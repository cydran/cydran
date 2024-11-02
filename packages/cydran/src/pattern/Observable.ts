interface Observable {

	notify(...payload: any[]): void;

	register(thisObject: Object, callback: (...payload: any[]) => void, predicate?: (...payload: any[]) => boolean, mapper?: (key: string, value: any) => any): void;

	unregister(thisObject: Object, callback: (...payload: any[]) => void): void;

}

export default Observable;
