import JSType from "const/JSType";
import { isDefined } from "util/Utils";

function asIdentity(input: any): any {
	return input;
}

function asBoolean(input: any): boolean {
	return Boolean(input);
}

/**
 * Get a string representation of the input.  Null will be returned if input is not defined or null itself.
 * @param input
 * @returns string | null
 */
function asString(input: any): string | null {
	let retval: string = null;
	if(isDefined(input)) {
		retval = input.toString();
	}
	return retval;
}
/**
 * Get a JSON string representation of the input.  Null will be returned if input is not defined or a null itself.
 * Use {@link #asString()} to get string represenations of BigInt, Symbol, or function; having no JSON representations available.
 * @param input
 * @returns string | null
 */
function asJSON(input: any): string | null {
	let retval: string = null;
	if(isDefined(input)) {
		switch(typeof input) {
			case JSType.BIGINT:
			case JSType.SYM:
			case JSType.FN:
				break;
			default:
				retval = JSON.stringify(input);
				break;
		}
	}
	return retval;
}

function asNumber(input: any): number {
	return isDefined(input) ? Number(input) : null;
}

export { asIdentity, asBoolean, asString, asNumber };
