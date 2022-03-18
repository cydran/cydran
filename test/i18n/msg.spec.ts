import msg from 'i18n/msg';

test("msg() - Unknown error message", () => {
	const result = msg(0);
	expect(result).toEqual("ERROR-00000");
});

test("msg() - Known error message", () => {
	const result = msg(1);
	expect(result).toEqual("ERROR-00001: Something went really wrong");
});
