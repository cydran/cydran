interface Validators {

	matches(regex: RegExp): Validators;

	isDefined(): Validators;

	oneOf(...options: any[]): Validators;

	requireIfDefined(name: string, requiredValue: any): Validators;

	requireIfEquals(expected: any, name: string, requiredValue: any): Validators;

	requireIfTrue(test: boolean): Validators;

	disallowIfTrue(test: boolean, message: string): Validators;

	notEmpty(): Validators;

	reject(message: string): Validators;

}

export default Validators;