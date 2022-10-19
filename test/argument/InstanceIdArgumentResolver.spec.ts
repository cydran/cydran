import InstanceIdArgumentResolver from "argument/InstanceIdArgumentResolver";
import RootContextImpl from 'context/RootContextImpl';

const context: RootContextImpl = new RootContextImpl();
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
