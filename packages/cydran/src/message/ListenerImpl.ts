import SimpleMap from "interface/SimpleMap";
import Listener from "message/Listener";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { isDefined, requireNotNull } from "util/Utils";

type Callback = (payload: unknown) => void;

class ListenerImpl implements Listener {

	private thisObjectFn: () => Object;

	private callbacks: SimpleMap<GarbageCollectablePairedSet<Object, Callback, Object>>;

	constructor(thisObjectFn: () => Object) {
		this.callbacks = {};
		this.thisObjectFn = requireNotNull(thisObjectFn, "thisObjectFn");
	}

	public receive(messageName: string, payload: unknown): void {
		const callbacksForMessageType: GarbageCollectablePairedSet<Object, Callback, Object> = this.callbacks[messageName];

		if (isDefined(callbacksForMessageType)) {
			callbacksForMessageType.forEach((thisObject: Object, callback: Callback) => {
				callback.call(thisObject, payload);
			});
		}
	}

	public register(messageName: string, callback: (payload: unknown) => void = null): void {
		requireNotNull(messageName, "messageName");

		if (!isDefined(this.callbacks[messageName])) {
			this.callbacks[messageName] = new GarbageCollectablePairedSetImpl<Object, Callback, Object>();
		}

		this.callbacks[messageName].add(this.thisObjectFn(), callback);
	}

	public $release(): void {
		this.callbacks = {};
		this.thisObjectFn = null;
	}
}

export default ListenerImpl;
