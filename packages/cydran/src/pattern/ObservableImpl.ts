import Observable from "pattern/Observable";
import { defaulted, isDefined, requireNotNull } from 'util/Utils';
import GarbageCollectablePairedSet from 'pattern/GarbageCollectablePairedSet';
import GarbageCollectablePairedSetImpl from 'pattern/GarbageCollectablePairedSetImpl';
import { CallBackThisObject } from "CydranTypes";

type Metadata = {

	predicate: Predicate;

	mapper: Mapper;

}

type Callback = (...payload: unknown[]) => void;

type Predicate = (...payload: unknown[]) => boolean;

type Mapper = (key: string, value: unknown) => unknown;

class ObservableImpl implements Observable {

	private callbacks: GarbageCollectablePairedSet<CallBackThisObject, Callback, Metadata>;

	constructor() {
		this.callbacks = new GarbageCollectablePairedSetImpl<CallBackThisObject, Callback, Metadata>();
	}

	public register(thisObject: CallBackThisObject, callback: Callback, predicate?: Predicate, mapper?: Mapper): void {
		requireNotNull(callback, "callback");

		const metadata: Metadata = {
			predicate: predicate,
			mapper: mapper
		};

		this.callbacks.add(defaulted(thisObject, {}), callback, metadata);
	}

	public unregister(thisObject: CallBackThisObject, callback: Callback): void {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");
		this.callbacks.remove(thisObject, callback);
	}

	public notify(...payload: unknown[]): void {
		this.callbacks.forEach((thisObject: CallBackThisObject, callback: Callback, meta: Metadata) => {
			if (!isDefined(meta.predicate) || meta.predicate.apply(meta.predicate, payload) === true) {
				callback.apply(thisObject, payload);
			}
		});
	}

}

export default ObservableImpl;
