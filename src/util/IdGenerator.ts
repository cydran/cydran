class IdGenerator {
	public static readonly INSTANCE: IdGenerator = new IdGenerator();

	private static readonly MAX_VALUE: number = 9007199254740989;

	private major: number;

	private minor: number;

	private micro: number;

	constructor() {
		this.major = 0;
		this.minor = 0;
		this.micro = 0;
	}

	public generate(): string {
		const result: string = `${this.major}-${this.minor}-${this.micro}`;

		this.micro++;

		if (this.micro > IdGenerator.MAX_VALUE) {
			this.micro = 0;
			this.minor++;
		}

		if (this.minor > IdGenerator.MAX_VALUE) {
			this.minor = 0;
			this.major++;
		}

		return result;
	}
}

export default IdGenerator;