import { requireNotNull } from "@/util/ObjectUtils";
import { asIdentity } from "@/model/Reducers";
import Watchable from "@/model/Watchable";
import { Watcher, Callback } from "@/filter/Interfaces";

class WatcherImpl<T> implements Watcher<T> {

	private value: any;

	private callbacks: Callback[];

	constructor(watchable: Watchable, expression: string) {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		this.callbacks = [];
		this.value = watchable.evaluate(expression);
		watchable.watch(expression, this.onChange, asIdentity, this);
	}

	public onChange(previous: any, current: any): void {
		this.value = current;

		for (const callback of this.callbacks) {
			callback.fn.apply(callback.context, []);
		}
	}

	public addCallback(context: any, callback: () => void): Watcher<T> {
		requireNotNull(context, "context");
		requireNotNull(callback, "callback");

		this.callbacks.push({
			context: context,
			fn: callback
		});

		return this;
	}

	public get(): T {
		return this.value as T;
	}

}

export default WatcherImpl;
