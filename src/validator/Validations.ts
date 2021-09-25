import { VALID_ID, VALID_KEY } from "const/HardValues";
import { isDefined } from 'util/Utils';

const validateDefined: (value: any) => string = (value: any) => isDefined(value) ? null : "must be defined";

const validateValidKey: (value: any) => string = (value: any) => !isDefined(value) || VALID_KEY.test(value) ? null : "must be valid key";

const validateValidId: (value: any) => string = (value: any) => !isDefined(value) || VALID_ID.test(value) ? null : "must be valid id";

const validateNotEmpty: (value: any) => string = (value: any) => isDefined(value) && (value + "").trim() === "" ? "must not be empty" : null;

function validateOneOf(...options: string[]): (value: any) => string {

	const actualOptions: string[] = options || [];

	const fn: (value: any) => string = (value: any) => {
		return isDefined(value) && actualOptions.indexOf(value) === -1
			? "must be one of " + actualOptions.join(", ")
			: null;
	};

	return fn;
}

export { validateDefined, validateValidKey, validateValidId, validateNotEmpty, validateOneOf };
