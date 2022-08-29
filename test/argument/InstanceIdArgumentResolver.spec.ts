import Context from "context/Context";
import InstanceIdArgumentResolver from "argument/InstanceIdArgumentResolver";
import DomImpl from 'dom/DomImpl';
import ContextsImpl from 'context/ContextsImpl';
import Services from "service/Services";
import ServicesImpl from "service/ServicesImpl";

const services: Services = new ServicesImpl(new DomImpl(), {});
const context: Context = new ContextsImpl(services).getDefaultContext();
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
	const id: string = specimen.resolve(context);
	expect(id).not.toBeNull();
	expect(id).toEqual("0-0-0");
});
