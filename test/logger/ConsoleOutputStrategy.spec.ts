import Level from 'log/Level';
import ConsoleOutputStrategy from 'log/ConsoleOutputStrategy';
import PropertiesImpl from "properties/PropertiesImpl";
import PropertyKeys from "const/PropertyKeys";

const msg: string = "test payload";
let cos: ConsoleOutputStrategy = null;

beforeAll(() => {
	const p: {} = {
		[PropertyKeys.CYDRAN_LOGGING_LEVEL]: "trace"
	};
	const wkprops: PropertiesImpl = new PropertiesImpl();
	wkprops.load(p);
	cos = new ConsoleOutputStrategy(wkprops);
});

test("ConsoleOutputStrategy is not null", () => {
	expect(cos).not.toBeNull();
});

test("log @ DISABLED level", () => {
	const wkSpy: ConsoleOutputStrategy = jest.spyOn(cos, 'log');
	cos.log("TEST_CLASS", Level.DISABLED, "should not log", false);
	expect(wkSpy).toBeCalledTimes(1);
});

test("log @ INFO level w/ FULLSTACK", () => {
	const wkSpy: ConsoleOutputStrategy = jest.spyOn(cos, 'log');
	cos.log("TEST_CLASS", Level.INFO, "with full stack", true);
	expect(wkSpy).toBeCalledTimes(1);
});

test("log @ every level", () => {
	const wkSpy: ConsoleOutputStrategy = jest.spyOn(cos, 'log');
	Object.keys(Level)
		.filter(k => !/\d+/.test(k))
		.forEach(key => {
			const wkLvl: Level = Level[key];
			cos.log("TEST_CLASS", wkLvl, `level logged = ${ key }`, false);
			expect(wkSpy).toBeCalledTimes(1);
			wkSpy.mockClear();
		}
	);
});
