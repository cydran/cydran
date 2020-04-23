import ObjectUtils from "@/util/ObjectUtils";

const isDefined = ObjectUtils.isDefined;

function asIdentity(input: any): any {
	return input;
}

function asBoolean(input: any): boolean {
	return Boolean(input);
}

function asString(input: any): string {
	return isDefined(input) ? ('' + input) : null;
}

function asNumber(input: any): number {
	return isDefined(input) ? Number(input) : null;
}

export { asIdentity, asBoolean, asString, asNumber };
