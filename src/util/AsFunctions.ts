import JSType from "const/JSType";
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
		switch(typeof input) {
			case JSType.STR:
				retval = input;
				break;
			case JSType.BOOL:
			case JSType.BIGINT:
			case JSType.NUM:
				retval = input + "";
				break;
			case JSType.SYM:
			case JSType.FN:
			case JSType.OBJ:
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
