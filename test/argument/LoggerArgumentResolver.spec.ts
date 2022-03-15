import Module from "module/Module";
import LoggerArgumentResolver from "argument/LoggerArgumentResolver";
import Logger from "log/Logger";
import DomImpl from 'dom/DomImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import CydranContext from "context/CydranContext";
import CydranContextImpl from "context/CydranContextImpl";

const cydranContext: CydranContext = new CydranContextImpl(new DomImpl(), {});
const module: Module = new ModulesContextImpl(cydranContext).getDefaultModule();

const LOGNAME: string = "TESTLOG" as const;

test("specimen is whole", () => {
	const specimen: LoggerArgumentResolver = new LoggerArgumentResolver(LOGNAME);
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: LoggerArgumentResolver = new LoggerArgumentResolver(LOGNAME);
	const logger: Logger = specimen.resolve(module);
	expect(logger).not.toBeNull();
	expect(logger.getName().trim()).toEqual(LOGNAME);
});
