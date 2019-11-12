
class GuardGenerator {

	public static readonly INSTANCE: GuardGenerator = new GuardGenerator();

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
		this.micro++;

		if (this.micro > GuardGenerator.MAX_VALUE) {
			this.micro = 0;
			this.minor++;
		}

		if (this.minor > GuardGenerator.MAX_VALUE) {
			this.minor = 0;
			this.major++;
		}

		return this.major + "-" + this.minor + "-" + this.micro;
	}

}

export default GuardGenerator;
