import InstanceIdArgumentResolver from "argument/resolver/InstanceIdArgumentResolver";
import GlobalContextImpl from 'context/GlobalContextImpl';
import Context from 'context/Context';

const context: Context = new GlobalContextImpl().createChild();
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
	const idRex = /\d{1,}\-\d{1,}\-\d{1,}/;
	const id: string = specimen.resolve(context);
	expect(id).not.toBeNull();
	expect(idRex.test(id)).toBe(true);
});

test("postProcess()", () => {
  const wkSpy: InstanceIdArgumentResolver = jest.spyOn(specimen, "postProcess");
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  specimen.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});
