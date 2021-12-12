import { isDefined } from "util/Utils";

function asIdentity(input: any): any {
	return input;
}

function asBoolean(input: any): boolean {
	return Boolean(input);
}

function asString(input: any): string {
	return (isDefined(input)) ? ((typeof input === 'string') ? input : JSON.stringify(input)) : null;
}

function asNumber(input: any): number {
	return isDefined(input) ? Number(input) : null;
}

export { asIdentity, asBoolean, asString, asNumber };
