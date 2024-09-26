import { Consumer } from "interface/Predicate";
import SimpleMap from "interface/SimpleMap";
import { isDefined, requireNotNull } from 'util/Utils';
import AdvancedMap from 'pattern/AdvancedMap';

const KEY: string = "key" as const;

class AdvancedMapImpl<T> implements AdvancedMap<T> {

	private values: SimpleMap<T>;

	constructor() {
		this.values = {};
	}

	public keys(): string[] {
		const result: string[] = [];

		for (const key in this.values) {
			if (this.values.hasOwnProperty(key)) {
				result.push(key);
			}
		}

		return result;
	}

	public remove(key: string): void {
		requireNotNull(key,  KEY);

		if (this.has(key)) {
			delete this.values[key];
		}
	}

	public has(key: string): boolean {
		requireNotNull(key,  KEY);

		return this.values.hasOwnProperty(key);
	}

	public lacks(key: string): boolean {
		requireNotNull(key,  KEY);

		return !this.has(key);
	}

	public get(key: string): T {
		requireNotNull(key,  KEY);

		const value: T = this.values[key];

		return isDefined(value) ? value : null;
	}

	public put(key: string, value: T): void {
		requireNotNull(key,  KEY);

		this.values[key] = isDefined(value) ? value : null;
	}

	public computeIfAbsent(key: string, supplier: (key: string) => T): T {
		requireNotNull(key,  KEY);

		if (this.lacks(key)) {
			const value: T = supplier(key);
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
