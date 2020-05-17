import { requireNotNull } from "@/util/ObjectUtils";
import { asIdentity } from "@/model/Reducers";
import Watchable from "@/model/Watchable";
import Watcher from "@/filter/Watcher";

class WatcherImpl<T> implements Watcher<T> {

	private value: any;

	private context: any;

	private callback: () => void;

	constructor(watchable: Watchable, expression: string, context: any, callback: () => void) {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		this.context = requireNotNull(context, "context");
		this.callback = requireNotNull(callback, "callback");
		this.value = watchable.evaluate(expression);
		watchable.watch(expression, this.onChange, asIdentity, this);
	}

	public onChange(previous: any, current: any): void {
		this.value = current;
		this.callback.apply(this.context, []);
	}

	public get(): T {
		return this.value as T;
	}

}

export default WatcherImpl;
