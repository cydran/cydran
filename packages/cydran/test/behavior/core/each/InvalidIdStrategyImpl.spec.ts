import InvalidIdStrategyImpl from "behavior/core/each/InvalidIdStrategyImpl";

let instance: InvalidIdStrategyImpl = null;

beforeEach(() => {
	instance = new InvalidIdStrategyImpl();
});

afterEach(() => {
	instance = null;
});

test("instance is good", () => {
	expect(instance).not.toBeNull();
	expect(instance).not.toBeUndefined();
});

test("init", () => {
	expect(() => { instance.init(); }).toThrowError(Error);
});

test("check", () => {
	expect(instance.check({})).toBeTruthy();
});

test("extract", () => {
	expect(instance.extract({})).toBeNull();
});

test("enrich", () => {
	const wkSpy: InvalidIdStrategyImpl = jest.spyOn(instance, 'enrich');
	instance.enrich({}, 0);
	expect(wkSpy).toBeCalledTimes(1);
});
