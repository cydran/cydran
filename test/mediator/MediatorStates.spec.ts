import MediatorStates from "mediator/MediatorStates";

describe("Expected constants of MediatorStates", () => {

	const enumStates: string[] = ["UNINITIALIZED", "READY", "MOUNTED", "UNMOUNTED", "DISPOSED"]

	test(`availability of each state: ${ JSON.stringify(enumStates) }`, () => {
		enumStates.forEach(val => {
			try {
				const specimen: Level = MediatorStates[val];
				expect(specimen).not.toBeNull();
			} catch (err) {
				fail(`bad value passed: ${val}`);
			}
		});
	});

	const badVal: string = "Whack";
	test(`failure with bad level: ${ badVal }`, () => {
		expect(MediatorStates[badVal]).toBe(undefined);
	});

});