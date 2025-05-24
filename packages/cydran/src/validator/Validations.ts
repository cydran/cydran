import { REGION_NAME, OBJECT_ID, CONTEXT_NAME, REQUESTABLE_OBJECT_PATH, SERIES_NAME } from 'CydranConstants';
import { isDefined } from 'util/Utils';
import { Predicate } from 'interface/Predicate';
import { asString } from "util/AsFunctions";

const validateDefined: (value: unknown, instance: unknown, state: unknown) => string =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(value: unknown, instance: unknown, state: unknown) => isDefined(value) ? null : "must be defined";

const validateValidRegionName: (value: unknown, instance: unknown, state: unknown) => string =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(value: string, instance: unknown, state: unknown) => !isDefined(value) || REGION_NAME.test(value) ? null : "must be valid region name";

const validateValidSeriesName: (value: unknown, instance: unknown, state: unknown) => string =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(value: string, instance: unknown, state: unknown) => !isDefined(value) || SERIES_NAME.test(value) ? null : "must be valid series name";

const validateValidObjectId: (value: unknown, instance: unknown, state: unknown) => string =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(value: string, instance: unknown, state: unknown) => !isDefined(value) || OBJECT_ID.test(value) ? null : "must be valid object id";

const validateValidContextName: (value: unknown, instance: unknown, state: unknown) => string =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(value: string, instance: unknown, state: unknown) => !isDefined(value) || CONTEXT_NAME.test(value) ? null : "must be valid context name";

const validateRequestableObjectPath: (value: string, instance: unknown, state: unknown) => string =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(value: string, instance: unknown, state: unknown) => !isDefined(value) || REQUESTABLE_OBJECT_PATH.test(value) ? null : "must be valid object path";

const validateNotEmptyString: (value: unknown, instance: unknown, state: unknown) => string =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(value: unknown, instance: unknown, state: unknown) => isDefined(value) && (asString(value)).trim() === "" ? "must not be empty" : null;

function validateNotNullIfFieldEquals(fieldName: string, expectedValue: string): (value: unknown, instance: unknown, state: unknown) => string {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn: (value: unknown, instance: unknown, state: unknown) => string = (value: unknown, instance: unknown, state: unknown) => {
		return isDefined(value) && instance[fieldName] !== expectedValue ? `must be defined as ${ fieldName } equals ${ expectedValue }` : null;
	};

	return fn;
}

function validateOneOf(...options: unknown[]): (value: unknown, instance: unknown, state: unknown) => string {
	const actualOptions: unknown[] = options || [];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const fn: (value: unknown, instance: unknown, state: unknown) => string = (value: unknown, instance: unknown, state: unknown) => {
		return isDefined(value) && actualOptions.indexOf(value) === -1
			? `must be one of [${ actualOptions.join(", ") }]`
			: null;
	};

	return fn;
}

function validateDefinedIf(predicate: Predicate<unknown>, expectation: string): (value: unknown, instance: unknown, state: unknown) => string {
	const fn: (value: unknown, instance: unknown, state: unknown) => string = (value: unknown, instance: unknown, state: unknown) => {
		return predicate(state) && !isDefined(value) ? `must be defined as ${ expectation }` : null;
	};

	return fn;
}

function validateNotDefinedIf(predicate: Predicate<unknown>, expectation: string): (value: unknown, instance: unknown, state: unknown) => string {
	const fn: (value: unknown, instance: unknown, state: unknown) => string = (value: unknown, instance: unknown, state: unknown) => {
		return predicate(state) && isDefined(value) ? `must not be defined as ${ expectation }` : null;
	};

	return fn;
}

export {
	validateDefined,
	validateValidRegionName,
	validateValidSeriesName,
	validateValidObjectId,
	validateValidContextName,
	validateRequestableObjectPath,
	validateNotEmptyString,
	validateOneOf,
	validateNotNullIfFieldEquals,
	validateDefinedIf,
	validateNotDefinedIf
};
