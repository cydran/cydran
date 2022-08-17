import Module from "module/Module";
import InstanceIdFnArgumentResolver from "argument/InstanceIdFnArgumentResolver";
import DomImpl from 'dom/DomImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import InstanceServices from "context/InstanceServices";
import InstanceServicesImpl from "context/InstanceServicesImpl";

const cydranContext: InstanceServices = new InstanceServicesImpl(new DomImpl(), {});
const module: Module = new ModulesContextImpl(cydranContext).getDefaultModule();

test("specimen is whole", () => {
	const specimen: InstanceIdFnArgumentResolver = new InstanceIdFnArgumentResolver();
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: InstanceIdFnArgumentResolver = new InstanceIdFnArgumentResolver();
	const idFn: Function = specimen.resolve(module);
	expect(idFn).not.toBeNull();
	expect(/^\d+\-\d+\-\d+$/.test(idFn())).toBe(true);
});
