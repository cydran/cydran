import noOp from 'function/noOp';
import { test, expect, jest } from '@jest/globals';

class MockObj {
	public doWork(): void {
		noOp();
	}
}

test("noOp", () => {
	const wkObj: MockObj = new MockObj();
	const wkSpy = jest.spyOn(wkObj, 'doWork');
	wkObj.doWork();
	expect(wkSpy).toBeCalledTimes(1);
});
