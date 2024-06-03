import { describe, test, expect } from "@jest/globals";
import { memoryUsage } from 'node:process';

describe("Garbage Collection", () => {

	test("API should present", () => {
		expect(typeof global.gc).toBe('function');
	});

	test("gc() works", () => {
		let memoryEater: string[] = [];
		memoryEater = new Array(1e6).fill('some string');
		const heapBefore: number = memoryUsage().heapUsed;
		memoryEater = null;

		global.gc();

		const heapAfter: number = memoryUsage().heapUsed;
		expect(heapAfter < heapBefore).toBeTruthy();
	});

});