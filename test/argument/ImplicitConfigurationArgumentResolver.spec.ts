import ImplicitConfigurationArgumentResolver from 'argument/ImplicitConfigurationArgumentResolver';

let icar: ImplicitConfigurationArgumentResolver = null;
const ID: string = "Whackadoodle007";
const context: Object = {id: ID};

beforeEach(() => {
  icar = new ImplicitConfigurationArgumentResolver(context);
});

afterEach(() => {
  icar = null;
});

test("ImplicitConfigurationArgumentResolver is not null", () => {
  expect(icar).not.toBe(null);
});

test("resolve(ctxt)", () => {
  expect(icar.resolve({}).id).toEqual(ID);
});

test("postProcess()", () => {
  const wkSpy: ImplicitConfigurationArgumentResolver = jest.spyOn(icar, "postProcess", null);
  const arg1: Object = {};
  const arg2: Object = {};
  const arg3: Object = {};
  icar.postProcess(arg1, arg2, arg3);
  expect(wkSpy).toHaveBeenCalledWith(arg1, arg2, arg3);
});