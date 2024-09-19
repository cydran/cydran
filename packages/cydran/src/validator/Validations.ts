import { REGION_NAME, OBJECT_ID, CONTEXT_NAME } from 'CydranConstants';
import { isDefined } from 'util/Utils';
import { Predicate } from 'interface/Predicate';
import { asString } from "util/AsFunctions";

const validateDefined: (value: any, instance: any, state: any) => string =
	(value: any, instance: any, state: any) => isDefined(value) ? null : "must be defined";

const validateValidRegionName: (value: any, instance: any, state: any) => string =
	(value: any, instance: any, state: any) => !isDefined(value) || REGION_NAME.test(value) ? null : "must be valid region name";

const validateValidObjectId: (value: any, instance: any, state: any) => string =
	(value: any, instance: any, state: any) => !isDefined(value) || OBJECT_ID.test(value) ? null : "must be valid object id";

const validateValidContextName: (value: any, instance: any, state: any) => string =
	(value: any, instance: any, state: any) => !isDefined(value) || CONTEXT_NAME.test(value) ? null : "must be valid context name";

const validateNotEmptyString: (value: any, instance: any, state: any) => string =
	(value: any, instance: any, state: any) => isDefined(value) && (asString(value)).trim() === "" ? "must not be empty" : null;

function validateNotNullIfFieldEquals(fieldName: string, expectedValue:string): (value: any, instance: any, state: any) => string {
	const fn: (value: any, instance: any, state: any) => string = (value: any, instance: any, state: any) => {
		return isDefined(value) && instance[fieldName] !== expectedValue ? `must be defined as ${ fieldName } equals ${ expectedValue }` : null;
	};

	return fn;
}

function validateOneOf(...options: any[]): (value: any, instance: any, state: any) => string {
	const actualOptions: any[] = options || [];

	const fn: (value: any, instance: any, state: any) => string = (value: any, instance: any, state: any) => {
		return isDefined(value) && actualOptions.indexOf(value) === -1
			? `must be one of [${ actualOptions.join(", ") }]`
			: null;
	};

	return fn;
}

function validateDefinedIf(predicate: Predicate<any>, expectation: string): (value: any, instance: any, state: any) => string {
	const fn: (value: any, instance: any, state: any) => string = (value: any, instance: any, state: any) => {
		return predicate(state) && !isDefined(value) ? `must be defined as ${ expectation }` : null;
	};

	return fn;
}

function validateNotDefinedIf(predicate: Predicate<any>, expectation: string): (value: any, instance: any, state: any) => string {
	const fn: (value: any, instance: any, state: any) => string = (value: any, instance: any, state: any) => {
		return predicate(state) && isDefined(value) ? `must not be defined as ${ expectation }` : null;
	};

	return fn;
}

export {
	validateDefined,
	validateValidRegionName,
	validateValidObjectId,
	validateValidContextName,
	validateNotEmptyString,
	validateOneOf,
	validateNotNullIfFieldEquals,
	validateDefinedIf,
	validateNotDefinedIf
};
