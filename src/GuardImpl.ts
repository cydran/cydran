import Guard from "./Guard";

interface ValueMap {

	[key: string]: string;

}

class GuardImpl implements Guard {

	public static up(original: Guard): Guard {
		return original || new GuardImpl(true);
	}

	public static down(original: Guard): Guard {
		return original || new GuardImpl(false);
	}

	private propagateUp: boolean;

	private state: ValueMap;

	constructor(propagateUp: boolean) {
		this.state = {};
		this.propagateUp = !!propagateUp;
	}

	public mark(value: string): void {
		if (value) {
			this.state[value] = value;
		}
	}

	public seen(value: string): boolean {
		return (value && this.state[value]) ? true : false;
	}

	public isPropagateUp(): boolean {
		return this.propagateUp;
	}

	public isPropagateDown(): boolean {
		return !this.propagateUp;
	}

}

export default GuardImpl;
