import LoggerFactory from "log/LoggerFactory";
import Level from "log/Level";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import PROPS from "./loggerTestProps.json";

let wkProps: Properties = null;
const enumStates: string[] = Object.keys(Level).map(k => { return Level[k]; }).reverse();

beforeAll(() => {
	wkProps = new PropertiesImpl();
	wkProps.load(PROPS);
});

afterAll(() => {
	wkProps = null;
});

beforeEach(() => {
	LoggerFactory.init(wkProps);
});

test("currentLevelAsString()", () => {
	expect(LoggerFactory.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
});

test("currentLevel()", () => {
	expect(LoggerFactory.currentLevel()).toEqual(Level.DEBUG);
});

test("updateLevel(name: string) - good", () => {
	expect(LoggerFactory.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
	enumStates.forEach((val) => {
		try {
			LoggerFactory.updateLevel(val);
			const current: string = LoggerFactory.currentLevelAsString();
			expect(current).toEqual(val);
		} catch (err) {
			fail(`bad value passed: ${ val }`);
		}
	});

	const baseline: string = "TRACE";
	LoggerFactory.updateLevel(baseline);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);

	const badVal: string = "whacko";
	LoggerFactory.updateLevel(badVal);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);
});

test("updateLevel(name: string) - bad", () => {
	expect(LoggerFactory.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
	const baseline: string = "TRACE";
	LoggerFactory.updateLevel(baseline);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);
	const badVal: string = "whacko";
	LoggerFactory.updateLevel(badVal);
	expect(LoggerFactory.currentLevelAsString()).toEqual(baseline);
});
