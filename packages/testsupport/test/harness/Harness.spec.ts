import Harness from "harness/Harness";
import { test, expect } from '@jest/globals';

test("placeholder", () => {
	expect(Harness).not.toBeNull()
	expect(true).toBeTruthy();
});