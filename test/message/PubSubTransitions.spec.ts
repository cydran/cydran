import PubSubTransitions from "message/PubSubTransitions";

describe("Expected constants of PubSubTransitions", () => {

	const enumStates: string[] = ["mounted", "unmounted"];

	test(`availability of each state: ${ JSON.stringify(enumStates) }`, () => {
		enumStates.forEach(val => {
			try {
				const specimen: Level = PubSubTransitions[val];
				expect(specimen).not.toBeNull();
			} catch (err) {
				fail(`bad value passed: ${val}`);
			}
		});
	});

	const badVal: string = "Whack";
	test(`failure with bad level: ${ badVal }`, () => {
		expect(PubSubTransitions[badVal]).toBe(undefined);
	});

});