import { validateDefined, validateValidKey, validateValidId, validateAttribNotEmpty } from "validator/Validations";

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
	const specs: string[] = ['', '1', 'a@&', 'Zasdf234@;'];
	specs.forEach(test => {
		expect(validateValidId(test, null, null)).toEqual("must be valid id");
	});
});

test("validateValidId good", () => {
	// \$\@\-\_\.\:\\\/
	const specs: string[] = ['Zasdf234@','a','m','A$','A@','A-','A_','A.','A:','A\\','A/'];
	specs.forEach(test => {
		expect(validateValidId(test, null, null)).toBeNull();
	});
});

test("validateAttribNotEmpty bad", () => {
	const spec: string = "";
	expect(validateAttribNotEmpty(spec, null, null)).toEqual("must not be empty");
});

test("validateAttribNotEmpty good", () => {
	const spec: string = "whackadoodle";
	expect(validateAttribNotEmpty(spec, null, null)).toBeNull();
});

test.skip("validateNotNullIfFieldEquals bad", () => {
	// not quite sure about how to test this one
});

test.skip("validateOneOf bad", () => {
	// not quite sure about how to test this one
});

test.skip("validateDefinedIf bad", () => {
	// not quite sure about how to test this one
});

test.skip("validateNotDefinedIf bad", () => {
	// not quite sure about how to test this one
});
