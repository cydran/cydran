import Level from "log/Level";

describe("Expected constants of Level", () => {

	const enumStates: string[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"];
	test(`availability of each level: ${ JSON.stringify(enumStates) }`, () => {
		enumStates.forEach(val => {
			try {
				const specimen: Level = Level[val];
				expect(specimen).not.toBeNull();
			} catch (err) {
				fail(`bad value passed: ${val}`);
			}
		});
	});

	const badVal: string = "Whack";
	test(`failure with bad level: ${ badVal }`, () => {
		expect(Level[badVal]).toBe(undefined);
	});

});
