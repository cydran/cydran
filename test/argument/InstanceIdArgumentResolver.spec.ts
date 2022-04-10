import Module from "module/Module";
import InstanceIdArgumentResolver from "argument/InstanceIdArgumentResolver";
import DomImpl from 'dom/DomImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import CydranContext from "context/CydranContext";
import CydranContextImpl from "context/CydranContextImpl";

const cydranContext: CydranContext = new CydranContextImpl(new DomImpl(), {});
const module: Module = new ModulesContextImpl(cydranContext).getDefaultModule();
let specimen: InstanceIdArgumentResolver;

beforeEach(() => {
	specimen = new InstanceIdArgumentResolver();
});

afterEach(() => {
	specimen = null;
});

test("specimen is whole", () => {
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const id: string = specimen.resolve(module);
	expect(id).not.toBeNull();
	expect(id).toEqual("0-0-1");
});
