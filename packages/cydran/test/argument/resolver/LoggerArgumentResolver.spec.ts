import Context from "context/Context";
import LoggerArgumentResolver from "argument/resolver/LoggerArgumentResolver";
import Logger from "log/Logger";
import GlobalContextImpl from 'context/GlobalContextImpl';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

const context: Context = new GlobalContextImpl().createChild();

const LOGNAME: string = "TESTLOG" as const;

let specimen: LoggerArgumentResolver;

describe("LoggerArgumentResolver", () => {

	beforeEach(() => {
		specimen = new LoggerArgumentResolver(LOGNAME);
	});

	afterEach(() => {
		specimen = null;
	});

	test("specimen is whole", () => {
		expect(specimen).not.toBeNull();
	});

	test("resolve item", () => {
		const logger: Logger = specimen.resolve(context);
		expect(logger).not.toBeNull();
		expect(logger.getKey().trim()).toEqual(LOGNAME);
	});

});
