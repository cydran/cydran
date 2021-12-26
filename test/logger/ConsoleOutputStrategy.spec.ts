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
