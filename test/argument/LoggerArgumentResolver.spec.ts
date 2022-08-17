import Module from "module/Module";
import LoggerArgumentResolver from "argument/LoggerArgumentResolver";
import Logger from "log/Logger";
import DomImpl from 'dom/DomImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import InstanceServices from "context/InstanceServices";
import InstanceServicesImpl from "context/InstanceServicesImpl";

const cydranContext: InstanceServices = new InstanceServicesImpl(new DomImpl(), {});
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
