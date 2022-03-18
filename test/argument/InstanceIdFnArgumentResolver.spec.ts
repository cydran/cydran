import Module from "module/Module";
import InstanceIdFnArgumentResolver from "argument/InstanceIdFnArgumentResolver";
import DomImpl from 'dom/DomImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import CydranContext from "context/CydranContext";
import CydranContextImpl from "context/CydranContextImpl";

const cydranContext: CydranContext = new CydranContextImpl(new DomImpl(), {});
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
