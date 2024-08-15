import { validateDefined, validateValidKey, validateValidId, validateNotEmptyString, validateOneOf, validateNotNullIfFieldEquals, validateDefinedIf, validateNotDefinedIf } from "validator/Validations";

const wkFn = (spec: {}) => spec['count'] === 0;
let wkObj: {count: number} = null;

beforeEach(() => {
	wkObj = { count: 0 };
});

afterEach(() => {
	wkObj = null;
});

test("valdiateDefined bad", () => {
	expect(validateDefined(null, {})).toEqual("must be defined");
});

test("valdiateDefined good", () => {
	expect(validateDefined("xyz", {})).toBeNull();
});

test("validateValidKey bad", () => {
	const spec: string = "abc234&#";
	expect(validateValidKey(spec, null, null)).toEqual("must be valid key");
});

test("validateValidKey good", () => {
	const spec: string = "ab$_c234";
	expect(validateValidKey(spec, null, null)).toBeNull();
});

test("validateValidId bad", () => {
	const specs: string[] = ['', '/'];
	specs.forEach(test => {
		expect(validateValidId(test, null, null)).toEqual("must be valid id");
	});
});

test("validateValidId good", () => {
	// \$\@\-\_\.\:\\\/
	const specs: string[] = ['Zasdf234@','a','m','A$','A@','A-','A_','A:','A\\'];
	specs.forEach(test => {
		expect(validateValidId(test, null, null)).toBeNull();
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
	expect(validateNotNullIfFieldEquals(fieldName, expectedValue)({}, {[fieldName]: 'Sally'}, null))
		.toEqual(`must be defined as ${ fieldName } equals ${ expectedValue }`);
});

test("validateNotNullIfFieldEquals good", () => {
	const fieldName: string = "xyz";
	const expectedValue: string = "bubba";
	expect(validateNotNullIfFieldEquals(fieldName, expectedValue)({}, {[fieldName]: expectedValue}, null)).toBeNull();
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
