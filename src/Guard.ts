interface ValueMap {

	[key: string]: string;

}

class Guard {

	public static from(original: Guard): Guard {
		return original || new Guard();
	}

	private state: ValueMap;

	constructor() {
		this.state = {};
	}

	public mark(value: string): void {
		if (value) {
			this.state[value] = value;
		}
	}

	public seen(value: string): boolean {
		return (value && this.state[value]) ? true : false;
	}

}

export default Guard;
