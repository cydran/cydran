import { requireNotNull } from "@/util/ObjectUtils";
import { asIdentity } from "@/model/Reducers";
import Watchable from "@/model/Watchable";
import { Watcher, Callback } from "@/filter/Interfaces";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";

class WatcherImpl<T> implements Watcher<T> {

	private value: any;

	private callbacks: Callback[];

	private logger: Logger;

	constructor(watchable: Watchable, expression: string) {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		this.logger = LoggerFactory.getLogger("WatcherImpl - " + expression);
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
