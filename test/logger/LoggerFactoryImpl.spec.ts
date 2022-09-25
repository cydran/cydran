import LoggerFactory from "log/LoggerFactory";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import Level from "log/Level";
import PropertiesImpl from "properties/PropertiesImpl";
import { Properties } from "properties/Property";
import PROPS from "./loggerTestProps.json";

let specimen: LoggerFactory = null;
let wkProps: Properties = null;

beforeAll(() => {
	wkProps = new PropertiesImpl();
	wkProps.load(PROPS);
});

afterAll(() => {
	wkProps = null;
});

beforeEach(() => {
	specimen = new LoggerFactoryImpl(wkProps);
});

afterEach(() => {
	specimen = null;
});

test("currentLevelAsString()", () => {
	expect(specimen.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
});

test("currentLevel()", () => {
	expect(specimen.currentLevel()).toEqual(Level.DEBUG);
});

test("updateLevel(name: string) - good", () => {
	expect(specimen.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
	const enumStates: string[] = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "DISABLED"].reverse();
	const results: {}[] = [];
	enumStates.forEach((val) => {
		try {
			specimen.updateLevel(val);
			const current: string = specimen.currentLevelAsString();
			results.push({'in': val, 'result': current});
			expect(current).toEqual(val);
		} catch (err) {
			fail(`bad value passed: ${ val }`);
		}
	});
	console.table(results);

	const baseline: string = "TRACE";
	specimen.updateLevel(baseline);
	expect(specimen.currentLevelAsString()).toEqual(baseline);

	const badVal: string = "whacko";
	specimen.updateLevel(badVal);
	expect(specimen.currentLevelAsString()).toEqual(baseline);
});

test("updateLevel(name: string) - bad", () => {
	expect(specimen.currentLevelAsString()).toEqual(Level[Level.DEBUG]);
	const baseline: string = "TRACE";
	specimen.updateLevel(baseline);
	expect(specimen.currentLevelAsString()).toEqual(baseline);
	const badVal: string = "whacko";
	specimen.updateLevel(badVal);
	expect(specimen.currentLevelAsString()).toEqual(baseline);
});
