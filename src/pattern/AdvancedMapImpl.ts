import { Consumer, Supplier } from "interface/Predicate";
import SimpleMap from "interface/SimpleMap";
import { isDefined, requireNotNull } from 'util/Utils';
import AdvancedMap from 'pattern/AdvancedMap';

class AdvancedMapImpl<T> implements AdvancedMap<T> {

	private values: SimpleMap<T>;

	constructor() {
		this.values = {};
	}

	public has(key: string): boolean {
		requireNotNull(key, "key");

		return this.values[key] ? true : false;
	}

	public lacks(key: string): boolean {
		return !this.has(key);
	}

	public get(key: string): T {
		const value: T = this.values[key];

		return isDefined(value) ? value : null;
	}

	public put(key: string, value: T): void {
		this.values[key] = value;
	}

	public computeIfAbsent(key: string, supplier: Supplier<T>): T {
		if (this.lacks(key)) {
			const value: T = supplier();
			this.put(key, value);
		}

		return this.get(key);
	}

	public each(consumer: Consumer<T>): void {
		for (const key in this.values) {
			if (!this.values.hasOwnProperty(key)) {
				continue;
			}

			const value: T = this.values[key];
			consumer(value);
		}
	}

	public clear(): void {
		this.values = {};
	}

}

export default AdvancedMapImpl;
