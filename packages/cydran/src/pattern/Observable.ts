interface Observable {

	notify(...payload: any[]): void;

	register(callback: (...payload: any[]) => void, predicate?: (...payload: any[]) => boolean): void;

	unregister(callback: (...payload: any[]) => void): void;

}

export default Observable;
