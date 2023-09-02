import MediatorTransitions from "mediator/MediatorTransitions";

describe("Expected constants of MediatorTransitions", () => {

	const enumStates: string[] = ["init", "dispose", "mount", "unmount"];

	test(`availability of each state: ${ JSON.stringify(enumStates) }`, () => {
		enumStates.forEach(val => {
			try {
				const specimen: Level = MediatorTransitions[val];
				expect(specimen).not.toBeNull();
			} catch (err) {
				fail(`bad value passed: ${val}`);
			}
		});
	});

	const badVal: string = "Whack";
	test(`failure with bad level: ${ badVal }`, () => {
		expect(MediatorTransitions[badVal]).toBe(undefined);
	});

});