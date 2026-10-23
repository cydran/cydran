import { requireNotNull } from "./Utils.js";

const OPTION_PREFIX: string = "--";

class Options {

	private values: string[];

	constructor(values: string[]) {
		this.values = requireNotNull(values, "values");
	}

	public has(name: string): boolean {
		requireNotNull(name, "name");

		return this.values.indexOf(OPTION_PREFIX + name) !== -1;
	}

	public getUnsupported(supportedNames: string[]): string[] {
		requireNotNull(supportedNames, "supportedNames");

		const supported: string[] = supportedNames.map((name) => OPTION_PREFIX + name);

		return this.values.filter((value) => supported.indexOf(value) === -1);
	}

}

export default Options;
