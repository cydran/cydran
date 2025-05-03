import Interval from "interval/Interval";
import { isDefined, requireNotNull } from 'util/Utils';

type Callback = () => void;
type SyncCallback = () => void;

class IntervalImpl implements Interval {

	private thisObjectRef: WeakRef<Object>;

	private callbackRef: WeakRef<Callback>;

	private syncFnRef: WeakRef<SyncCallback>;

	private enabled: boolean;

	private delay: number;

	private intervalId: unknown;

	constructor(thisObject: Object, callback: Callback, delay: number, syncFn: SyncCallback) {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");
		requireNotNull(syncFn, "syncFn");
		this.thisObjectRef = new WeakRef(thisObject);
		this.callbackRef = new WeakRef(callback);
		this.delay = requireNotNull(delay, "delay");
		this.syncFnRef = new WeakRef(syncFn);
		this.enabled = false;
		this.intervalId = null;
	}

	public enable(): void {
		if (!this.enabled) {
			this.intervalId = setInterval(() => {
				const thisObject = this.thisObjectRef.deref();
				const callback = this.callbackRef.deref();
				const syncFn = this.syncFnRef.deref();

				if (isDefined(thisObject) && isDefined(callback) && isDefined(syncFn)) {
					callback.apply(thisObject, []);
					syncFn();
				}
			}, this.delay);

			this.enabled = true;
		}
	}

	public disable(): void {
		if (this.enabled) {
			clearInterval(this.intervalId as number);
			this.intervalId = null;
			this.enabled = false;
		}
	}

}

export default IntervalImpl;
