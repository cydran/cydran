import LoggerFactory from "log/LoggerFactory";
import { assertNullGuarded } from "test/TestUtils";

test("getLogger() - null name", () => {
	assertNullGuarded("name", () => LoggerFactory.getLogger(null));
});

test("getLevelAsString()", () => {
	const result: string = LoggerFactory.currentLevel();
	expect(result).toEqual("INFO");
});

test("updateLevel(name: string)", () => {
	expect(LoggerFactory.currentLevel()).toEqual("INFO");
	const enumStates: string[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"].reverse();
	const results: {}[] = [];
	enumStates.forEach((val) => {
		try {
			LoggerFactory.updateLevel(val);
			const current: string = LoggerFactory.currentLevel();
			results.push({'in': val, 'result': current});
			expect(current).toEqual(val);
		} catch (err) {
			fail(`bad value passed: ${ val }`);
		}
	});
	console.table(results);

	const baseline: string = "TRACE";
	LoggerFactory.updateLevel(baseline);
	expect(LoggerFactory.currentLevel()).toEqual(baseline);
	const badVal: string = "whacko";
	LoggerFactory.updateLevel(badVal);
	console.log(`current level: ${LoggerFactory.currentLevel()} : ${baseline}`);
	expect(LoggerFactory.currentLevel()).toEqual(baseline);
});
