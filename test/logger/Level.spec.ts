import Level from "log/Level";

const enumStates: string[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"];

test("availability of each level", () => {
	enumStates.forEach(val => {
		try {
			const specimen: Level = Level[val];
			expect(specimen).not.toBeNull();
		} catch (err) {
			fail(`bad value passed: ${val}`);
		}
	});
});
