import { Consumer } from "interface/Predicate";
import Queue from "pattern/Queue";
import { requireNotNull } from 'util/Utils';

class QueueImpl<T> implements Queue<T> {

	private items: T[];

	constructor() {
		this.items = [];
	}

	public add(item: T): void {
		requireNotNull(item, "item");

		this.items.push(item);
	}

	public pop(): T {
		return this.isEmpty() ? null : this.items.pop();
	}

	public isEmpty(): boolean {
		return this.items.length === 0;
	}

	public isPopulated(): boolean {
		return !this.isEmpty();
	}

	public transform(tranformFn: (item: T, consumer: Consumer<T>) => void): void {
		requireNotNull(tranformFn, "tranformFn");

		while (this.isPopulated()) {
			tranformFn(this.pop(), (item: T) => this.add(item));
		}
	}

}

export default QueueImpl;
