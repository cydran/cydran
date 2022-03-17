import Watchable from "interface/ables/Watchable";
import Watcher from "digest/Watcher";
import Callback from "interface/Callback";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
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
		watchable.watch(expression, this.onChange, asIdentity, this);
	}

	public onChange(previous: any, current: any): void {
		this.logger.ifTrace(() => ({
			message: "Changed",
			previous: previous,
			current: current
		}));

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
