import IntervalImpl from "interval/IntervalImpl";
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

let spec: IntervalImpl = null;

describe("IntervalImpl", () => {

	beforeEach(() => {
		spec = new IntervalImpl({}, () => { }, 500, () => { });
	});

	afterEach(() => {
		spec = null;
	});

	test("not null", () => {
		expect(spec).not.toBeNull();
	});

});
