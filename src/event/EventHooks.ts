interface EventHooks<T> {
	add(listener: (context: T) => void): void;

	notify(context: T): void;
}

export default EventHooks;
