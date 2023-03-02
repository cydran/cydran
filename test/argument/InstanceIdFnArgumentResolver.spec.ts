import Context from "context/Context";
import InstanceIdFnArgumentResolver from "argument/InstanceIdFnArgumentResolver";
import StageImpl from 'context/RootContextImpl';

const context: Context = new StageImpl("body");

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
