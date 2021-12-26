import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { isDefined } from 'util/Utils';

const wkVals: string[] = ["one", "two", "three", "four", "five"];
let specimen: AdvancedMapImpl = null;

const wkFn: Function = (key: string) => { return key.split('').reverse().join().replaceAll(',', ''); };
class TestClass {
	private static result: Object;

	constructor(context: Object = {}) {
		TestClass.result = context;
	}

	public doWork(encKey: string): void {
		const wkKey: string = wkFn(encKey);
		TestClass.result[wkKey] = {'fnIncoming': encKey, 'result': wkKey};
	}
}

beforeEach(() => {
	specimen = new AdvancedMapImpl();

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

test("each", () => {
	const context: Object = {};
	const tClass: TestClass = new TestClass(context);
	const spy = jest.spyOn(tClass, 'doWork');

	specimen.each(tClass.doWork);

	expect(spy).toBeCalledTimes(wkVals.length);
	Object.keys(context).forEach((k: string) => {
		if(context.hasOwnProperty(k)) {
			const tstObj: Object = context[k];
			expect(tstObj['fnIncoming']).toEqual(wkFn(k));
			expect(tstObj['result']).toEqual(k);
		}
	});
});
