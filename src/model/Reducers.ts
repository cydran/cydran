function asIdentity(input: any): any {
	return input;
}

function asBoolean(input: any): boolean {
	return Boolean(input);
}

function asString(input: any): string {
	return '' + input;
}

function asNumber(input: any): number {
	return Number(input);
}

export { asIdentity, asBoolean, asString, asNumber };
