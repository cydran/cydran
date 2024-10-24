import Observable from "pattern/Observable";
import { isDefined, requireNotNull } from 'util/Utils';
import GarbageCollectableSet from 'pattern/GarbageCollectableSet';
import GarbageCollectableSetImpl from 'pattern/GarbageCollectableSetImpl';

type Metadata = {

	thisObject: Object;

	predicate: Predicate;

	mapper: Mapper;

}

type Callback = (...payload: any[]) => void;

type Predicate = (...payload: any[]) => boolean;

type Mapper = (key: string, value: any) => any;

class ObservableImpl implements Observable {

	private callbacks: GarbageCollectableSet<Callback, Metadata>;

	constructor() {
		this.callbacks = new GarbageCollectableSetImpl<Callback, Metadata>();
	}

	public register(thisObject: Object = {}, callback: Callback, predicate?: Predicate, mapper?: Mapper): void {
		requireNotNull(callback, "callback");

		const metadata: Metadata = {
			thisObject: thisObject,
			predicate: predicate,
			mapper: mapper
		};

		this.callbacks.add(callback, metadata);
	}

	public unregister(callback: Callback): void {
		requireNotNull(callback, "callback");
		this.callbacks.remove(callback);
	}

	public notify(...payload: any[]): void {
		this.callbacks.forEach((callback: Callback, meta: Metadata) => {
			if (!isDefined(meta.predicate) || meta.predicate.apply(meta.predicate, payload) === true) {
				callback.apply(meta.thisObject, payload);
			}
		});
	}

}

export default ObservableImpl;
