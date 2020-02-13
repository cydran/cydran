const MAX_SAFE_INTEGER: number = 9007199254740989;

class SequenceGenerator {

	public static INSTANCE: SequenceGenerator = new SequenceGenerator();

	private value: number;

	constructor() {
		this.value = 0;
	}

	public next(): number {
		if (this.value >= MAX_SAFE_INTEGER) {
			this.value = -1;
		}

		this.value++;

		return this.value;
	}

}

export default SequenceGenerator;
