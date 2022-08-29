import Watchable from "interface/ables/Watchable";
import Watcher from "digest/Watcher";
import Callback from "interface/Callback";
import Logger from "log/Logger";
import { requireNotNull } from "util/Utils";
import { asIdentity } from "util/AsFunctions";

class WatcherImpl<T> implements Watcher<T> {

	private value: any;

	private callbacks: Callback[];

	private logger: Logger;

	constructor(watchable: Watchable, expression: string, logr: Logger) {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		this.logger = logr;
		this.callbacks = [];
		this.value = watchable.evaluate(expression);
		watchable.onExpressionChange(expression, this.onChange, asIdentity, this);
	}

	public onChange(previous: any, current: any): void {
		this.logger.ifTrace(() => ({
			message: "Changed",
			previous: previous,
			current: current
		}));

		this.value = current;

		for (const callback of this.callbacks) {
			callback.fn.apply(callback.targetThis, []);
		}
	}

	public addCallback(targetThis: any, callback: () => void): Watcher<T> {
		requireNotNull(targetThis, "targetThis");
		requireNotNull(callback, "callback");

		this.callbacks.push({
			targetThis: targetThis,
			fn: callback
		});

		return this;
	}

	public get(): T {
		return this.value as T;
	}
}

export default WatcherImpl;
