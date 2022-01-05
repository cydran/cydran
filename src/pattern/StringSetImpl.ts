import StringSet from "pattern/StringSet";

class StringSetSetImpl implements StringSet {

	private values: any;

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
		let count: number = 0;

		for (const key in this.values) {
			if (!this.values.hasOwnProperty(key)) {
				continue;
			}

			++count;
		}

		return count;
	}

	public isEmpty(): boolean {
		return this.size() === 0;
	}

	public isPopulated(): boolean {
		return !this.isEmpty();
	}

}

export default StringSetSetImpl;
