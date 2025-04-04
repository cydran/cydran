import { describe, test, expect } from "@jest/globals";
import { memoryUsage } from 'node:process';
import gc from "expose-gc/function";

describe("Garbage Collection", () => {

	test("API should present", () => {
		expect(typeof gc).toBe('function');
	});

	test("gc() works", () => {
		let memoryEater: string[] = [];
		memoryEater = new Array(1e6).fill('some string');
		const heapBefore: number = memoryUsage().heapUsed;
		memoryEater = null as unknown as string[];

		gc();

		const heapAfter: number = memoryUsage().heapUsed;
		expect(heapAfter < heapBefore).toBeTruthy();
	});

});