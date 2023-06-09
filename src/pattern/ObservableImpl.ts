import Observable from "pattern/Observable";
import { removeFromArray, isDefined, requireNotNull } from 'util/Utils';

class ObservableImpl implements Observable {

	private callbackReferences: WeakRef<(...payload: any[]) => void>[];

	constructor() {
		this.callbackReferences = [];
	}

	public register(callback: (...payload: any[]) => void): void {
		requireNotNull(callback, "callback");
		this.prune();
		this.unregister(callback);
		this.callbackReferences.push(new WeakRef(callback));
	}

	public unregister(callback: (...payload: any[]) => void): void {
		this.prune();

		const removableReferences: WeakRef<(...payload: any[]) => void>[] = [];

		for (const callbackReference of this.callbackReferences) {
			if (callbackReference.deref() === callback) {
				removableReferences.push(callbackReference);
			}
		}

		for (const removableReference of removableReferences) {
			removeFromArray(this.callbackReferences, removableReference);
		}
	}

	public notify(...payload: any[]): void {
		this.prune();

		for (const callbackReference of this.callbackReferences) {
			const callback: (...payload: any[]) => void = callbackReference.deref();

			if (isDefined(callback)) {
				callback.apply(callback, payload);
			}
		}
	}

	private prune(): void {
		const removableReferences: WeakRef<(...payload: any[]) => void>[] = [];

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