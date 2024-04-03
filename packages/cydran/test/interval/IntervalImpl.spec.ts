import IntervalImpl from "interval/IntervalImpl";

let spec: IntervalImpl = null;

beforeEach(() => {
  spec = new IntervalImpl({}, () => {}, 500, () => {});
});

afterEach(() => {
  spec = null;
});

test("not null", () => {
  expect(spec).not.toBeNull();
});

test("enable", () => {
  const iSpy: IntervalImpl = jest.spyOn(spec, 'enable');
  spec.enable();
  expect(iSpy).toHaveBeenCalledTimes(1);
});

test("disable", () => {
  const iSpy: IntervalImpl = jest.spyOn(spec, 'disable');
  spec.disable();
  expect(iSpy).toHaveBeenCalledTimes(1);
});