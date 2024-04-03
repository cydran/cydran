import IntervalsImpl from "interval/IntervalsImpl";

let spec: IntervalsImpl = null;

beforeEach(() => {
  spec = new IntervalsImpl({}, () => {});
});

afterEach(() => {
  spec = null;
});

test("add", () => {
  const iSpy: IntervalsImpl = jest.spyOn(spec, 'add');
  spec.add(() => {}, 500);
  expect(iSpy).toHaveBeenCalledTimes(1);
});

test("clear", () => {
  const iSpy: IntervalsImpl = jest.spyOn(spec, 'clear');
  spec.clear();
  expect(iSpy).toHaveBeenCalledTimes(1);
});

test("enable", () => {
  const iSpy: IntervalsImpl = jest.spyOn(spec, 'enable');
  spec.enable();
  expect(iSpy).toHaveBeenCalledTimes(1);
});

test("disable", () => {
  const iSpy: IntervalsImpl = jest.spyOn(spec, 'disable');
  spec.disable();
  expect(iSpy).toHaveBeenCalledTimes(1);
});