import PubSubStates from "message/PubSubStates";

describe("Expected constants of PubSubStates", () => {

	const enumStates: string[] = ["MOUNTED", "UNMOUNTED"];
	
	test("availability of each state", () => {
		enumStates.forEach(val => {
			try {
				const specimen: Level = PubSubStates[val];
				expect(specimen).not.toBeNull();
			} catch (err) {
				fail(`bad value passed: ${val}`);
			}
		});
	});

	test("failure with bad level", () => {
		expect(PubSubStates["Whack"]).toBe(undefined);
	});

});