import SimpleMap from "interface/SimpleMap";
import StringSet from "pattern/StringSet";

class StringSetImpl implements StringSet {

	private values: SimpleMap<boolean>;

	constructor() {
		this.values = {};
	}

	public add(value: string): void {
		const key: string = '' + value.trim();
		this.values[key] = true;
	}

	public remove(value: string): void {
		const key: string = '' + value.trim();

		if (this.values[key]) {
			delete this.values[key];
		}
	}

	public contains(value: string): boolean {
		const key: string = '' + value.trim();
		return !!this.values[key];
	}

	public clear(): void {
		this.values = {};
	}

	public size(): number {
		const count: number = Object.keys(this.values).length;
		return count;
	}

	public isEmpty(): boolean {
		return this.size() === 0;
	}

	public isPopulated(): boolean {
		return !this.isEmpty();
	}

}

export default StringSetImpl;
