import Interval from "interval/Interval";
import IntervalImpl from "interval/IntervalImpl";
import Intervals from "interval/Intervals";
import GarbageCollectableSet from "pattern/GarbageCollectableSet";
import GarbageCollectableSetImpl from "pattern/GarbageCollectableSetImpl";
import { requireNotNull } from 'util/Utils';

type Callback = () => void;

class IntervalsImpl implements Intervals {

	private thisObject: any;

	private intervals: GarbageCollectableSet<Callback, Interval>;

	private enabled: boolean;

	private syncFn: () => void;

	constructor(thisObject: Object, syncFn: () => void) {
		this.thisObject = requireNotNull(thisObject, "targetThis");
		this.syncFn = requireNotNull(syncFn, "syncFn");
		this.intervals = new GarbageCollectableSetImpl<Callback, Interval>();
		this.enabled = false;
	}

	public add(callback: () => void, delay: number = 1000): void {
		requireNotNull(callback, "callback");
		const interval: Interval = new IntervalImpl(this.thisObject, callback, delay, this.syncFn);

		this.intervals.add(callback, interval, (interval: Interval) => {
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
		this.intervals.forEach((callback: Callback, interval: Interval) => {
			interval.enable();
		});

		this.enabled = true;
	}

	public disable(): void {
		this.intervals.forEach((callback: Callback, interval: Interval) => {
			interval.disable();
		});

		this.enabled = false;
	}

}

export default IntervalsImpl;