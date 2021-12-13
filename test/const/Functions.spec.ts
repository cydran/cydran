
import { EMPTY_OBJECT_FN, NO_OP_FN } from 'const/Functions';

class MockObj {
	public doWork(): void {
		NO_OP_FN();
	}
}

test("EMPTY_OBJECT_FN", () => {
	const expected: Object = {};
	const result: Object = EMPTY_OBJECT_FN();
	expect(result).toEqual(expected);
});

test("NO_OP_FN", () => {
	const wkObj: MockObj = new MockObj();
	const wkSpy = jest.spyOn(wkObj, 'doWork');
	wkObj.doWork();
	expect(wkSpy).toBeCalledTimes(1);
});
