import { isDefined, requireNotNull } from "util/Utils";
import PairedWeakMap from 'pattern/PairedWeakMap';

class PairedWeakMapImpl<K extends object, L extends object, V extends object> implements PairedWeakMap<K, L, V> {
	
	private map: WeakMap<K, WeakMap<L, V>>;

	constructor() {
		this.map = new WeakMap<K, WeakMap<L, V>>();
	}

	public set(firstKey: K, secondKey: L, value: V): void {
		requireNotNull(firstKey, "firstKey");
		requireNotNull(secondKey, "secondKey");

		let secondMap: WeakMap<L, V> | undefined = this.map.get(firstKey);

		if (!isDefined(secondMap)) {
			secondMap = new WeakMap<L,V>();
			this.map.set(firstKey, secondMap);
		}

		secondMap.set(secondKey, value);
	}

	public get(firstKey: K, secondKey: L): V | undefined {
		requireNotNull(firstKey, "firstKey");
		requireNotNull(secondKey, "secondKey");

		const secondMap: WeakMap<L, V> | undefined = this.map.get(firstKey);

		return isDefined(secondMap) ? secondMap.get(secondKey) : undefined;
	}

	public delete(firstKey: K, secondKey: L): void {
		requireNotNull(firstKey, "firstKey");
		requireNotNull(secondKey, "secondKey");

		const secondMap: WeakMap<L, V> | undefined = this.map.get(firstKey);

		if (isDefined(secondMap)) {
			secondMap.delete(secondKey);
		}
	}

	public has(firstKey: K, secondKey: L): boolean {
		requireNotNull(firstKey, "firstKey");
		requireNotNull(secondKey, "secondKey");

		const secondMap: WeakMap<L, V> | undefined = this.map.get(firstKey);

		return isDefined(secondMap) && secondMap.has(secondKey);
	}

	public clear(): void {
		this.map = new WeakMap<K, WeakMap<L, V>>();
	}

}

export default PairedWeakMapImpl;
