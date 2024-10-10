import IterableWeakSet from "pattern/IterableWeakSet";
import { isDefined, removeFromArray, requireNotNull } from "util/Utils";

class IterableWeakSetImpl<R extends Object, S extends Object> implements IterableWeakSet<R, S> {

	private items: WeakRef<R>[];

	private metadata: WeakMap<R, S>;

	constructor() {
		this.items = [];
		this.metadata = new WeakMap();
	}

	public add(item: R, metadata: S = {} as S): void {
		requireNotNull(item, "item");
		this.remove(item);
		this.prune();
		this.items.push(new WeakRef(item));
		this.metadata.set(item, metadata);
	}

	public remove(item: R): void {
		this.prune();

		const removableItems: WeakRef<R>[] = this.items.filter((ref) => ref.deref() === item);

		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}

	public forEach(callback: (refObject: R, metadata: S) => void): void {
		this.prune();

		for (const ref of this.items) {
			const item: R = ref.deref();
			const metadata: S = this.metadata.get(item);

			if (isDefined(item)) {
				callback(item, metadata);
			}
		}
	}

	public clear(): void {
		this.items = [];
		this.metadata = new WeakMap();
	}

	private prune(): void {
		const removableItems: WeakRef<R>[] = this.items.filter((i) => !isDefined(i.deref()));

		for (const removable of removableItems) {
			removeFromArray(this.items, removable);
		}
	}
}

export default IterableWeakSetImpl;