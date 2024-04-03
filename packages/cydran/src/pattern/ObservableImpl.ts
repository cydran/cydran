import Observable from "pattern/Observable";
import { removeFromArray, isDefined, requireNotNull } from 'util/Utils';

class ObservableImpl implements Observable {

	private callbackReferences: WeakRef<(...payload: any[]) => void>[];

	private callbackPredicates: WeakMap<(...payload: any[]) => void, WeakRef<(...payload: any[]) => boolean>>;

	constructor() {
		this.callbackReferences = [];
		this.callbackPredicates = new WeakMap();
	}

	public register(callback: (...payload: any[]) => void, predicate?: (...payload: any[]) => boolean): void {
		requireNotNull(callback, "callback");
		this.prune();
		this.unregister(callback);

		if (isDefined(predicate)) {
			this.callbackPredicates.set(callback, new WeakRef(predicate));
		}

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

		this.callbackPredicates.delete(callback);
	}

	public notify(...payload: any[]): void {
		this.prune();

		for (const callbackReference of this.callbackReferences) {
			const callback: (...payload: any[]) => void = callbackReference.deref();

			if (isDefined(callback)) {
				const predicate: () => boolean = this.callbackPredicates.has(callback) ? this.callbackPredicates.get(callback).deref() : null;

				if (!isDefined(predicate) || predicate.apply(predicate, payload) === true) {
					callback.apply(callback, payload);
				}
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
