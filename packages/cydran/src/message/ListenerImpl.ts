import SimpleMap from "interface/SimpleMap";
import Listener from "message/Listener";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { isDefined, requireNotNull } from "util/Utils";
import { CallBackThisObject } from 'CydranTypes';

type Callback = (payload: unknown) => void;

type Metadata = {
	before: () => void,
	after: () => void
};

class ListenerImpl implements Listener {

	private thisObjectFn: () => CallBackThisObject;

	private callbacks: SimpleMap<GarbageCollectablePairedSet<CallBackThisObject, Callback, Metadata>>;

	constructor(thisObjectFn: () => CallBackThisObject) {
		this.callbacks = {};
		this.thisObjectFn = requireNotNull(thisObjectFn, "thisObjectFn");
	}

	public receive(messageName: string, payload: unknown): void {
		const callbacksForMessageType: GarbageCollectablePairedSet<CallBackThisObject, Callback, Metadata> = this.callbacks[messageName];

		if (isDefined(callbacksForMessageType)) {
			callbacksForMessageType.forEach((thisObject: CallBackThisObject, callback: Callback, metadata: Metadata) => {
				if (isDefined(thisObject) && isDefined(callback)) {
					if (isDefined(metadata) && isDefined(metadata.before)) {
						metadata.before.apply({});
					}

					callback.call(thisObject, payload);

					if (isDefined(metadata) && isDefined(metadata.after)) {
						metadata.after.apply({});
					}
				}
			});
		}
	}

	public register(messageName: string, callback: (payload: unknown) => void = null as unknown as (payload: unknown) => void, before?: () => void, after?: () => void): void {
		requireNotNull(messageName, "messageName");

		if (!isDefined(this.callbacks[messageName])) {
			this.callbacks[messageName] = new GarbageCollectablePairedSetImpl<CallBackThisObject, Callback, Metadata>();
		}

		this.callbacks[messageName].add(this.thisObjectFn(), callback, { before: before as () => void, after: after as () => void });
	}

	public $release(): void {
		this.callbacks = {};
		this.thisObjectFn = null as unknown as () => CallBackThisObject;
	}
}

export default ListenerImpl;
