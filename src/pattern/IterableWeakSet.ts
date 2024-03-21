import { isDefined, removeFromArray, requireNotNull } from "util/Utils";

class IterableWeakSet<T extends object> {

	private items: WeakRef<T>[];

	constructor() {
		this.items = [];
	}

	public add(item: T): void {
		requireNotNull(item, "item");
		this.remove(item);
		this.items.push(new WeakRef(item));
	}

	public remove(item: T): void {
		this.prune();

		const removableItems: WeakRef<T>[] = this.items.filter((i) => i.deref() === i);
		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}

	public forEach(callback: (item: T) => void): void {
		this.prune();

		for (const item of this.items) {
			callback(item.deref());
		}
	}

	public clear(): void {
		this.items = [];
	}

	private prune(): void {
		const removableItems: WeakRef<T>[] = this.items.filter((i) => !isDefined(i.deref()));
		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}

}

export default IterableWeakSet;
