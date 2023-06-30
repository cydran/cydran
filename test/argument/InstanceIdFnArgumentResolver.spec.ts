import Context from "context/Context";
import InstanceIdFnArgumentResolver from "argument/InstanceIdFnArgumentResolver";
import { StageImpl } from 'context/RootContextImpl';

const context: Context = new StageImpl("body");


let specimen: InstanceIdFnArgumentResolver;

beforeEach(() => {
	specimen = new InstanceIdFnArgumentResolver();
});

afterEach(() => {
	specimen = null;
});

test("specimen is whole", () => {
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const idFn: Function = specimen.resolve(context);
	expect(idFn).not.toBeNull();
	expect(/^\d+\-\d+\-\d+$/.test(idFn())).toBe(true);
});

test("postProcess()", () => {
  const wkSpy: InstanceIdFnArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});