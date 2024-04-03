import AdvancedMapImpl from "pattern/AdvancedMapImpl";

const wkVals: string[] = ["one", "two", "three", "four", "five"];
let specimen: AdvancedMapImpl = null;

const wkFn: Function = (key: string) => { return key.split('').reverse().join().replaceAll(',', ''); };

class TestClass {

	private static result: Object;

	constructor(state: Object = {}) {
		TestClass.result = state;
	}

	public doWork(encKey: string): void {
		const wkKey: string = wkFn(encKey);
		TestClass.result[wkKey] = {'fnIncoming': encKey, 'result': wkKey};
	}

}

beforeEach(() => {
	specimen = new AdvancedMapImpl<TestClass>();
	for(const wkVal of wkVals) {
		specimen.put(wkVal, wkFn(wkVal));
	}
});

afterEach(() => {
	specimen = null;
});

test("non-null instance", () => {
	expect(specimen).not.toBeNull();
});

test("clear called", () => {
	const wkSpy = jest.spyOn(specimen, 'clear');
	specimen.clear();
	expect(wkSpy).toBeCalledTimes(1);
});

test("remove", () => {
	const wkSpy: AdvancedMapImpl = jest.spyOn(specimen, "remove");
	for(const v of wkVals) {
		specimen.remove(v);
	}
	expect(wkSpy).toHaveBeenCalledTimes(wkVals.length);
	expect(() => specimen.remove(null)).toThrowError();
});

test("each", () => {
	const state: Object = {};
	const tClass: TestClass = new TestClass(state);
	const spy = jest.spyOn(tClass, 'doWork');

	specimen.each(tClass.doWork);

	expect(spy).toBeCalledTimes(wkVals.length);
	Object.keys(state).forEach((k: string) => {
		if (state.hasOwnProperty(k)) {
			const tstObj: Object = state[k];
			expect(tstObj['fnIncoming']).toEqual(wkFn(k));
			expect(tstObj['result']).toEqual(k);
		}
	});
});
