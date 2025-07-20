import { CallBackThisObject } from "CydranTypes";
import Interval from "interval/Interval";
import IntervalImpl from "interval/IntervalImpl";
import Intervals from "interval/Intervals";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { requireNotNull } from 'util/Utils';

type Callback = () => void;

class IntervalsImpl implements Intervals {

	private thisObject: CallBackThisObject;

	private intervals: GarbageCollectablePairedSet<CallBackThisObject, Callback, Interval>;

	private enabled: boolean;

	private syncFn: () => void;

	constructor(thisObject: CallBackThisObject, syncFn: () => void) {
		this.thisObject = requireNotNull(thisObject, "thisObject");
		this.syncFn = requireNotNull(syncFn, "syncFn");
		this.intervals = new GarbageCollectablePairedSetImpl<CallBackThisObject, Callback, Interval>();
		this.enabled = false;
	}

	public add(callback: () => void, delay: number = 1000): void {
		requireNotNull(callback, "callback");
		const interval: Interval = new IntervalImpl(this.thisObject, callback, delay, this.syncFn);

		this.intervals.add(this.thisObject, callback, interval, (interval: Interval) => {
			interval.disable();
		});

		if (this.enabled) {
			interval.enable();
		}
	}

	public clear(): void {
		this.disable();
		this.intervals.clear();
	}

	public enable(): void {
		this.intervals.forEach((thisObject: CallBackThisObject, callback: Callback, interval: Interval) => {
			interval.enable();
		});

		this.enabled = true;
	}

	public disable(): void {
		this.intervals.forEach((thisObject: CallBackThisObject, callback: Callback, interval: Interval) => {
			interval.disable();
		});

		this.enabled = false;
	}

}

export default IntervalsImpl;