import Context from "context/Context";
import InstanceIdFnArgumentResolver from "argument/InstanceIdFnArgumentResolver";
import DomImpl from 'dom/DomImpl';
import ContextsImpl from 'context/ContextsImpl';
import Services from "service/Services";
import ServicesImpl from "service/ServicesImpl";

const services: Services = new ServicesImpl(new DomImpl(), {});
const context: Context = new ContextsImpl(services).getDefaultContext();

test("specimen is whole", () => {
	const specimen: InstanceIdFnArgumentResolver = new InstanceIdFnArgumentResolver();
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const specimen: InstanceIdFnArgumentResolver = new InstanceIdFnArgumentResolver();
	const idFn: Function = specimen.resolve(context);
	expect(idFn).not.toBeNull();
	expect(/^\d+\-\d+\-\d+$/.test(idFn())).toBe(true);
});
