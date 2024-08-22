import { validateDefined, validateValidRegionName, validateNotEmptyString, validateOneOf, validateNotNullIfFieldEquals, validateDefinedIf, validateNotDefinedIf, validateValidObjectId, validateValidContextName } from 'validator/Validations';
import { beforeEach, describe, afterEach, test, expect } from '@jest/globals';

const wkFn = (spec: {}) => spec['count'] === 0;
let wkObj: { count: number } = null as unknown as { count: number };

describe("Validations", () => {

	beforeEach(() => {
		wkObj = { count: 0 };
	});

	afterEach(() => {
		wkObj = null as unknown as { count: number };
	});

	test("valdiateDefined bad", () => {
		expect(validateDefined(null, {})).toEqual("must be defined");
	});

	test("valdiateDefined good", () => {
		expect(validateDefined("xyz", {})).toBeNull();
	});

	test("validateValidRegionName bad", () => {
		const spec: string = "abc234&#";
		expect(validateValidRegionName(spec, null, null)).toEqual("must be valid region name");
	});

	test("validateValidRegionName good", () => {
		const spec: string = "abCd";
		expect(validateValidRegionName(spec, null, null)).toBeNull();
	});

	test("validateValidObjectId bad", () => {
		const specs: string[] = ['', '/', 'foo$', 'bar@', 'foo\\', 'bar/'];
		specs.forEach(test => {
			expect(validateValidObjectId(test, null, null)).toEqual("must be valid object id");
		});
	});

	test("validateValidObjectId good", () => {
		// \$\@\-\_\.\:\\\/
		const specs: string[] = ['Zasdf234', 'a', 'm', 'A', 'foo*bar', 'baz:bat', 'baz-', 'bat_', 'qux.' ];
		specs.forEach(test => {
			expect(validateValidObjectId(test, null, null)).toBeNull();
		});
	});

	test("validateValidContextName bad", () => {
		const specs: string[] = ['', '/', 'foo$', 'bar@', 'baz-', 'bat_', 'qux.', 'quux:', 'foo\\', 'bar/'];
		specs.forEach(test => {
			expect(validateValidContextName(test, null, null)).toEqual("must be valid context name");
		});
	});

	test("validateValidContextName good", () => {
		// \$\@\-\_\.\:\\\/
		const specs: string[] = ['Zasdf234', 'a', 'm', 'A'];
		specs.forEach(test => {
			expect(validateValidContextName(test, null, null)).toBeNull();
		});
	});

	test("validateNotEmptyString bad", () => {
		const spec: string = "";
		expect(validateNotEmptyString(spec, null, null)).toEqual("must not be empty");
	});

	test("validateNotEmptyString good", () => {
		const spec: string = "whackadoodle";
		expect(validateNotEmptyString(spec, null, null)).toBeNull();
	});

	test("validateNotNullIfFieldEquals bad", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNotNullIfFieldEquals(fieldName, expectedValue)({}, { [fieldName]: 'Sally' }, null))
			.toEqual(`must be defined as ${fieldName} equals ${expectedValue}`);
	});

	test("validateNotNullIfFieldEquals good", () => {
		const fieldName: string = "xyz";
		const expectedValue: string = "bubba";
		expect(validateNotNullIfFieldEquals(fieldName, expectedValue)({}, { [fieldName]: expectedValue }, null)).toBeNull();
	});

	test("validateOneOf bad", () => {
		expect(validateOneOf("foo", "bar")("bat", null, null)).toEqual("must be one of [foo, bar]");
	});

	test("validateOneOf good", () => {
		expect(validateOneOf("foo", "bar")("foo", null, null)).toBeNull();
	});

	const NOTEQZ = "having a count != 0";

	test("validateDefinedIf - unmet condition", () => {
		const result = validateDefinedIf(wkFn, NOTEQZ)(null, null, wkObj);
		expect(result).toEqual(`must be defined as ${NOTEQZ}`);
	});

	test("validateDefinedIf - met condition", () => {
		wkObj.count++;
		const result = validateDefinedIf(wkFn, NOTEQZ)(null, null, wkObj);
		expect(result).toBeNull();
	});

	test("validateNotDefinedIf - unmet condition", () => {
		const wkval: string = "abc";
		expect(validateNotDefinedIf(wkFn, NOTEQZ)(wkval, null, wkObj)).toEqual(`must not be defined as ${NOTEQZ}`);
	});

	test("validateNotDefinedIf - met condition", () => {
		const wkval: string = "abc";
		wkObj.count++;
		const result = validateNotDefinedIf(wkFn, NOTEQZ)(wkval, null, wkObj);
		expect(result).toBeNull();
	});

});
