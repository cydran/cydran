import Observable from "pattern/Observable";
import { removeFromArray, isDefined, requireNotNull } from 'util/Utils';

class ObservableImpl<T> implements Observable<T> {

	private callbackReferences: WeakRef<(value: T) => void>[];

	constructor() {
		this.callbackReferences = [];
	}

	public register(callback: (payload: T) => void): void {
		requireNotNull(callback, "callback");
		this.prune();
		this.unregister(callback);
		this.callbackReferences.push(new WeakRef(callback));
	}

	public unregister(callback: (payload: T) => void): void {
		this.prune();

		const removableReferences: WeakRef<(value: T) => void>[] = [];

		for (const callbackReference of this.callbackReferences) {
			if (callbackReference.deref() === callback) {
				removableReferences.push(callbackReference);
			}
		}

		for (const removableReference of removableReferences) {
			removeFromArray(this.callbackReferences, removableReference);
		}
	}

	public notify(payload: T): void {
		this.prune();

		for (const callbackReference of this.callbackReferences) {
			const callback: (value: T) => void = callbackReference.deref();

			if (isDefined(callback)) {
				callback(payload);
			}
		}
	}

	private prune(): void {
		const removableReferences: WeakRef<(value: T) => void>[] = [];

		for (const callbackReference of this.callbackReferences) {
			if (!isDefined(callbackReference.deref())) {
				removableReferences.push(callbackReference);
			}
		}

		for (const removableReference of removableReferences) {
			removeFromArray(this.callbackReferences, removableReference);
		}
	}

}

export default ObservableImpl;
