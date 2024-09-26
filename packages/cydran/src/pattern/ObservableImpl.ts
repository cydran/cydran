import Observable from "pattern/Observable";
import { removeFromArray, isDefined, requireNotNull, defaulted } from 'util/Utils';

class ObservableImpl implements Observable {

	// TODO - Correct objectThis for callbacks and weakly reference

	private callbackReferences: WeakRef<(...payload: any[]) => void>[];

	private callbackPredicates: WeakMap<(...payload: any[]) => void, WeakRef<(...payload: any[]) => boolean>>;

	private thisObjectReferences: WeakMap<(...payload: any[]) => void, WeakRef<any>>;

	constructor() {
		this.callbackReferences = [];
		this.callbackPredicates = new WeakMap();
		this.thisObjectReferences = new WeakMap();
	}

	public register(thisObject: any, callback: (...payload: any[]) => void, predicate?: (...payload: any[]) => boolean, mapper?: (key: string, value: any) => any): void {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");
		this.prune();
		this.unregister(callback);

		const actualThisObject: any = defaulted(thisObject, {});

		if (isDefined(predicate)) {
			this.callbackPredicates.set(callback, new WeakRef(predicate));
		}

		this.thisObjectReferences.set(callback, new WeakRef(actualThisObject));
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

		this.thisObjectReferences.delete(callback);
		this.callbackPredicates.delete(callback);
	}

	public notify(...payload: any[]): void {
		this.prune();

		for (const callbackReference of this.callbackReferences) {
			const callback: (...payload: any[]) => void = callbackReference.deref();

			if (isDefined(callback)) {
				const predicate: () => boolean = this.callbackPredicates.has(callback) ? this.callbackPredicates.get(callback).deref() : null;

				if (!isDefined(predicate) || predicate.apply(predicate, payload) === true) {
					const thisObject: any = this.thisObjectReferences.get(callback).deref();
					callback.apply(thisObject, payload);
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
