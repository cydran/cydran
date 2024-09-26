import SimpleMap from "interface/SimpleMap";
import Listener from "message/Listener";
import { isDefined, requireNotNull } from "util/Utils";

class ListenerImpl implements Listener {

	// TODO - Correct objectThis for callbacks and weakly reference

	private targetThisFn: () => any;

	private callbacks: SimpleMap<((payload: any) => void)[]>;

	constructor(targetThisFn: () => any) {
		this.callbacks = {};
		this.targetThisFn = requireNotNull(targetThisFn, "targetThisFn");
	}

	public receive(messageName: string, payload: any): void {
		const callbacksForMessageType: ((payload: any) => void)[] = this.callbacks[messageName];

		if (isDefined(callbacksForMessageType)) {
			for (const callback of callbacksForMessageType) {
				callback.call(this.targetThisFn(), payload);
			}
		}
	}

	public register(messageName: string, callback: (payload: any) => void = null): void {
		requireNotNull(messageName, "messageName");

		if (!isDefined(this.callbacks[messageName])) {
			this.callbacks[messageName] = [];
		}

		this.callbacks[messageName].push(callback);
	}

	public $release(): void {
		this.callbacks = {};
		this.targetThisFn = null;
	}
}

export default ListenerImpl;
