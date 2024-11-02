import Observable from "pattern/Observable";
import { isDefined, requireNotNull } from 'util/Utils';
import GarbageCollectablePairedSet from 'pattern/GarbageCollectablePairedSet';
import GarbageCollectablePairedSetImpl from 'pattern/GarbageCollectablePairedSetImpl';

type Metadata = {

	predicate: Predicate;

	mapper: Mapper;

}

type Callback = (...payload: any[]) => void;

type Predicate = (...payload: any[]) => boolean;

type Mapper = (key: string, value: any) => any;

class ObservableImpl implements Observable {

	private callbacks: GarbageCollectablePairedSet<Object, Callback, Metadata>;

	constructor() {
		this.callbacks = new GarbageCollectablePairedSetImpl<Object, Callback, Metadata>();
	}

	public register(thisObject: Object = {}, callback: Callback, predicate?: Predicate, mapper?: Mapper): void {
		requireNotNull(callback, "callback");

		const metadata: Metadata = {
			predicate: predicate,
			mapper: mapper
		};

		this.callbacks.add(thisObject, callback, metadata);
	}

	public unregister(thisObject: Object, callback: Callback): void {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");
		this.callbacks.remove(thisObject, callback);
	}

	public notify(...payload: any[]): void {
		this.callbacks.forEach((thisObject: Object, callback: Callback, meta: Metadata) => {
			if (!isDefined(meta.predicate) || meta.predicate.apply(meta.predicate, payload) === true) {
				callback.apply(thisObject, payload);
			}
		});
	}

}

export default ObservableImpl;
