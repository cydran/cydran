import Interval from "interval/Interval";
import IntervalImpl from "interval/IntervalImpl";
import Intervals from "interval/Intervals";
import { requireNotNull } from 'util/Utils';

class IntervalsImpl implements Intervals {

	private context: any;

	private intervals: Interval[];

	private enabled: boolean;

	private syncFn: () => void;

	constructor(context: any, syncFn: () => void) {
		this.context = requireNotNull(context, "context");
		this.syncFn = requireNotNull(syncFn, "syncFn");
		this.intervals = [];
		this.enabled = false;
	}

	public add(callback: () => void, delay: number = 1000): void {
		requireNotNull(callback, "callback");
		const interval: Interval = new IntervalImpl(this.context, callback, delay, this.syncFn);

		this.intervals.push(interval);

		if (this.enabled) {
			interval.enable();
		}
	}

	public clear(): void {
		this.disable();
		this.intervals = [];
	}

	public enable(): void {
		// tslint:disable-next-line
		for (let i: number = 0; i < this.intervals.length; i++) {
			const interval: Interval = this.intervals[i];
			interval.enable();
		}

		this.enabled = true;
	}

	public disable(): void {
		// tslint:disable-next-line
		for (let i: number = 0; i < this.intervals.length; i++) {
			const interval: Interval = this.intervals[i];
			interval.disable();
		}

		this.enabled = false;
	}

}

export default IntervalsImpl;