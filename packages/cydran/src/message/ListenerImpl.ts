import SimpleMap from "interface/SimpleMap";
import Listener from "message/Listener";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { isDefined, requireNotNull } from "util/Utils";
import { CallBackThisObject } from 'CydranTypes';

type Callback = (payload: unknown) => void;

class ListenerImpl implements Listener {

	private thisObjectFn: () => CallBackThisObject;

	private callbacks: SimpleMap<GarbageCollectablePairedSet<CallBackThisObject, Callback, CallBackThisObject>>;

	constructor(thisObjectFn: () => CallBackThisObject) {
		this.callbacks = {};
		this.thisObjectFn = requireNotNull(thisObjectFn, "thisObjectFn");
	}

	public receive(messageName: string, payload: unknown): void {
		const callbacksForMessageType: GarbageCollectablePairedSet<CallBackThisObject, Callback, CallBackThisObject> = this.callbacks[messageName];

		if (isDefined(callbacksForMessageType)) {
			callbacksForMessageType.forEach((thisObject: CallBackThisObject, callback: Callback) => {
				callback.call(thisObject, payload);
			});
		}
	}

	public register(messageName: string, callback: (payload: unknown) => void = null): void {
		requireNotNull(messageName, "messageName");

		if (!isDefined(this.callbacks[messageName])) {
			this.callbacks[messageName] = new GarbageCollectablePairedSetImpl<CallBackThisObject, Callback, CallBackThisObject>();
		}

		this.callbacks[messageName].add(this.thisObjectFn(), callback);
	}

	public $release(): void {
		this.callbacks = {};
		this.thisObjectFn = null;
	}
}

export default ListenerImpl;
