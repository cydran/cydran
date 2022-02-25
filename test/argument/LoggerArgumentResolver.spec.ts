import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import LoggerArgumentResolver from "argument/LoggerArgumentResolver";
import Logger from "log/Logger";

const LOGNAME: string = "TESTLOG" as const;

let wkModule: Module;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: LoggerArgumentResolver = new LoggerArgumentResolver(LOGNAME);
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: LoggerArgumentResolver = new LoggerArgumentResolver(LOGNAME);
	const logger: Logger = specimen.resolve(wkModule);
	expect(logger).not.toBeNull();
	expect(logger.getName().trim()).toEqual(LOGNAME);
});
