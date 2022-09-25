import Context from "context/Context";
import LoggerArgumentResolver from "argument/LoggerArgumentResolver";
import Logger from "log/Logger";
import ContextImpl from 'context/ContextImpl';

const context: Context = new ContextImpl();

const LOGNAME: string = "TESTLOG" as const;

test("specimen is whole", () => {
	const specimen: LoggerArgumentResolver = new LoggerArgumentResolver(LOGNAME);
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: LoggerArgumentResolver = new LoggerArgumentResolver(LOGNAME);
	const logger: Logger = specimen.resolve(context);
	expect(logger).not.toBeNull();
	expect(logger.getName().trim()).toEqual(LOGNAME);
});
