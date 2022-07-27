import Interval from "interval/Interval";
import { requireNotNull } from 'util/Utils';

class IntervalImpl implements Interval {

	private context: any;

	private callback: () => void;

	private syncFn: () => void;

	private enabled: boolean;

	private delay: number;

	private intervalId: any;

	constructor(context: any, callback: () => void, delay: number, syncFn: () => void) {
		this.context = requireNotNull(context, "context");
		this.callback = requireNotNull(callback, "callback");
		this.delay = requireNotNull(delay, "delay");
		this.syncFn = requireNotNull(syncFn, "syncFn");
		this.enabled = false;
		this.intervalId = null;
	}

	public enable(): void {
		if (!this.enabled) {
			this.intervalId = setInterval(() => {
				this.callback.apply(this.context, []);
				this.syncFn();
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
