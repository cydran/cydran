import PubSubStates from "message/PubSubStates";

describe("Expected constants of PubSubStates", () => {

	const enumStates: string[] = ["MOUNTED", "UNMOUNTED"];

	test(`availability of each state: ${ JSON.stringify(enumStates) }`, () => {
		enumStates.forEach(val => {
			try {
				const specimen: Level = PubSubStates[val];
				expect(specimen).not.toBeNull();
			} catch (err) {
				fail(`bad value passed: ${val}`);
			}
		});
	});

	const badVal: string = "Whack";
	test(`failure with bad level: ${ badVal }`, () => {
		expect(PubSubStates[badVal]).toBe(undefined);
	});

});