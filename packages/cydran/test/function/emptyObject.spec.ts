import emptyObject from "function/emptyObject";
import { test, expect } from '@jest/globals';

test("emptyObject", () => {
	const expected: Object = {};
	const result: Object = emptyObject();
	expect(result).toEqual(expected);
});
