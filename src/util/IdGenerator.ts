class IdGenerator {

	public static readonly INSTANCE: IdGenerator = new IdGenerator();

	private maxValue: number;

	private major: number;

	private minor: number;

	private micro: number;

	constructor(major: number = 0, minor: number = 0, micro: number = 0, max: number = 9007199254740989) {
		this.major = major;
		this.minor = minor;
		this.micro = micro;
		this.maxValue = max;
	}

	public generate(): string {
		const result: string = `${ this.major }-${ this.minor }-${ this.micro }`;

		this.micro++;

		if (this.micro > this.maxValue) {
			this.micro = 0;
			this.minor++;
		}

		if (this.minor > this.maxValue) {
			this.minor = 0;
			this.major++;
		}

		return result;
	}

	public upperBoundary(): number {
		return this.maxValue;
	}

}

export default IdGenerator;
