import Context from "context/Context";
import InstanceIdFnArgumentResolver from "argument/InstanceIdFnArgumentResolver";
import ContextImpl from 'context/ContextImpl';

const context: Context = new ContextImpl();

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
