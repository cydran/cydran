import Context from "context/Context";
import LoggerArgumentResolver from "argument/resolver/LoggerArgumentResolver";
import Logger from "log/Logger";
import GlobalContextImpl from 'context/GlobalContextImpl';

const context: Context = new GlobalContextImpl().createChild();

const LOGNAME: string = "TESTLOG" as const;

let specimen: LoggerArgumentResolver;

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
	expect(logger.getName().trim()).toEqual(LOGNAME);
});

test("postProcess()", () => {
  const wkSpy: LoggerArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});
