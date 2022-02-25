import EventHooks from "event/EventHooks";
import { requireNotNull } from "util/Utils";

class EventHooksImpl<T> implements EventHooks<T> {
	private listeners: ((context: T) => void)[];

	constructor() {
		this.listeners = [];
	}

	public add(listener: (context: T) => void): void {
		requireNotNull(listener, "listener");
		this.listeners.push(listener);
	}

	public notify(context: T): void {
		for (const listener of this.listeners) {
			listener.apply({}, [context]);
		}
	}
}

export default EventHooksImpl;
