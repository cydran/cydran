import { isDefined } from "util/Utils";

function asIdentity(input: any): any {
	return input;
}

function asBoolean(input: any): boolean {
	return Boolean(input);
}

function asString(input: any): string {
	let retval: string = null;
	if(isDefined(input)) {
		const tOf: string = typeof input;
		switch(tOf) {
			case "string":
				retval = input;
				break;
			case "function":
			case "object":
				retval = JSON.stringify(input);
				break;
			case "symbol":
				retval = input.toString();
				break;
			default:
				retval = input + "";
				break;
		}
	}
	return retval;
}

function asNumber(input: any): number {
	return isDefined(input) ? Number(input) : null;
}

export { asIdentity, asBoolean, asString, asNumber };
