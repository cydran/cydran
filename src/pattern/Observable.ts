interface Observable<T> {

	notify(payload: T): void;

	register(callback: (payload: T) => void): void;

	unregister(callback: (payload: T) => void): void;

}

export default Observable;
