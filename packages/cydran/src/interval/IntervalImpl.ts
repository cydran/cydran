import Interval from "interval/Interval";
import { isDefined, requireNotNull } from 'util/Utils';

type Callback = () => void;
type SyncCallback = () => void;

class IntervalImpl implements Interval {

	private targetThisRef: WeakRef<Object>;

	private callbackRef: WeakRef<Callback>;

	private syncFnRef: WeakRef<SyncCallback>;

	private enabled: boolean;

	private delay: number;

	private intervalId: any;

	constructor(targetThis: Object, callback: Callback, delay: number, syncFn: SyncCallback) {
		requireNotNull(targetThis, "targetThis");
		requireNotNull(callback, "callback");
		requireNotNull(syncFn, "syncFn");
		this.targetThisRef = new WeakRef(targetThis);
		this.callbackRef = new WeakRef(callback);
		this.delay = requireNotNull(delay, "delay");
		this.syncFnRef = new WeakRef(syncFn);
		this.enabled = false;
		this.intervalId = null;
	}

	public enable(): void {
		if (!this.enabled) {
			this.intervalId = setInterval(() => {
				const targetThis = this.targetThisRef.deref();
				const callback = this.callbackRef.deref();
				const syncFn = this.syncFnRef.deref();

				if (isDefined(targetThis) && isDefined(callback) && isDefined(syncFn)) {
					callback.apply(targetThis, []);
					syncFn();
				}
			}, this.delay);

			this.enabled = true;
		}
	}

	public disable(): void {
		if (this.enabled) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.enabled = false;
		}
	}

}

export default IntervalImpl;
