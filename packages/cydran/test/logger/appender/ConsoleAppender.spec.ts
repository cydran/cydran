import { test, expect, beforeAll, describe } from "@jest/globals";
import ConsoleAppender from 'log/appender/ConsoleAppender';

let specimen: ConsoleAppender = null;

describe("ConsoleAppender", () => {

	beforeAll(() => {
		specimen = new ConsoleAppender("id");
	});

	test("ConsoleAppender is not null", () => {
		expect(specimen).not.toBeNull();
	});

});
