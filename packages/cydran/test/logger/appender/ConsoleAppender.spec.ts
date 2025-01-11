import { test, expect, beforeAll, jest, describe } from "@jest/globals";
import Level from 'log/Level';
import PropertiesImpl from "properties/PropertiesImpl";
import { PropertyKeys } from "CydranConstants";
import ConsoleAppenderImpl from 'log/appender/ConsoleAppender';

const msg: string = "test payload";
let cos: ConsoleAppenderImpl = null;

describe("ConsoleAppender", () => {

	beforeAll(() => {
		const p: {} = {
			[PropertyKeys.CYDRAN_LOG_LEVEL]: "trace"
		};
		const wkprops: PropertiesImpl = new PropertiesImpl();
		wkprops.load(p);
		cos = new ConsoleAppenderImpl(wkprops);
	});

	test("ConsoleAppender is not null", () => {
		expect(cos).not.toBeNull();
	});

});
