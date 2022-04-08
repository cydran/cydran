import { VALID_ID, VALID_KEY } from "const/HardValues";
import { isDefined } from 'util/Utils';
import { Predicate } from 'interface/Predicate';
import { asString } from "util/AsFunctions";

const validateDefined: (value: any, instance: any, context: any) => string =
	(value: any, instance: any, context: any) => isDefined(value) ? null : "must be defined";

const validateValidKey: (value: any, instance: any, context: any) => string =
	(value: any, instance: any, context: any) => !isDefined(value) || VALID_KEY.test(value) ? null : "must be valid key";

const validateValidId: (value: any, instance: any, context: any) => string =
	(value: any, instance: any, context: any) => !isDefined(value) || VALID_ID.test(value) ? null : "must be valid id";

const validateNotEmptyString: (value: any, instance: any, context: any) => string =
	(value: any, instance: any, context: any) => isDefined(value) && (asString(value)).trim() === "" ? "must not be empty" : null;

function validateNotNullIfFieldEquals(fieldName: string, expectedValue:string): (value: any, instance: any, context: any) => string {
	const fn: (value: any, instance: any, context: any) => string = (value: any, instance: any, context: any) => {
		return isDefined(value) && instance[fieldName] !== expectedValue ? `must be defined as ${fieldName} equals ${expectedValue}` : null;
	};

	return fn;
}

function validateOneOf(...options: any[]): (value: any, instance: any, context: any) => string {
	const actualOptions: any[] = options || [];

	const fn: (value: any, instance: any, context: any) => string = (value: any, instance: any, context: any) => {
		return isDefined(value) && actualOptions.indexOf(value) === -1
			? `must be one of [${ actualOptions.join(", ") }]`
			: null;
	};

	return fn;
}

function validateDefinedIf(predicate: Predicate<any>, expectation: string): (value: any, instance: any, context: any) => string {
	const fn: (value: any, instance: any, context: any) => string = (value: any, instance: any, context: any) => {
		return predicate(context) && !isDefined(value) ? `must be defined as ${expectation}` : null;
	};

	return fn;
}

function validateNotDefinedIf(predicate: Predicate<any>, expectation: string): (value: any, instance: any, context: any) => string {
	const fn: (value: any, instance: any, context: any) => string = (value: any, instance: any, context: any) => {
		return predicate(context) && isDefined(value) ? `must not be defined as ${expectation}` : null;
	};

	return fn;
}

export {
	validateDefined,
	validateValidKey,
	validateValidId,
	validateNotEmptyString,
	validateOneOf,
	validateNotNullIfFieldEquals,
	validateDefinedIf,
	validateNotDefinedIf
};
