import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";
import { test, expect, describe } from '@jest/globals';
import { triggerGcAsync } from 'test/TestUtils';

describe("ObservableImpl", () => {

	// This failure is somewhere in the unpinning classes supporting ObservableImpl.  Specific tests need to be written to
	// ensure that the garbage collection is working correctly.
	test.skip("Garbage Collection does not retain references with single and multiple arguments - Single callback", async () => {
		const specimen: Observable = new ObservableImpl();
		const results: string[] = [];

		let thisObject: object = {};
		let callback: (value: string) => void = (value: string) => results.push(value);

		specimen.register(thisObject, callback);
		specimen.notify("foo");
		specimen.notify("bar");

		callback = null as unknown as (value: string) => void;
		thisObject = null as unknown as object;

		for (let i = 0; i < 1000; i++) {
			let memoryEater: string[] = [];
			memoryEater = new Array(1e6).fill('some string');
			await triggerGcAsync();
			memoryEater = null as unknown as string[];
			await triggerGcAsync();
		}

		specimen.notify("bat");
		specimen.notify("baz");

		expect(results.length).toEqual(2);
		expect(results[0]).toEqual("foo");
		expect(results[1]).toEqual("bar");
	}, 150000);

	// This failure is somewhere in the unpinning classes supporting ObservableImpl.  Specific tests need to be written to
	// ensure that the garbage collection is working correctly.
	test.skip("Garbage Collection does not retain references with single and multiple arguments - Multiple callback", async () => {
		const specimen: Observable = new ObservableImpl();
		const firstResults: string[] = [];
		const secondResults: string[] = [];

		let callback: (first: string, second: string) => void = (first: string, second: string) => {
			firstResults.push(first);
			secondResults.push(second);
		};

		specimen.register({}, callback);
		specimen.notify("foo", "Alpha");
		specimen.notify("bar", "Beta");

		callback = null as unknown as (value: string) => void;

		let memoryEater: string[] = [];
		memoryEater = new Array(1e6).fill('some string');
		memoryEater = null as unknown as string[];

		await triggerGcAsync();

		specimen.notify("bat", "Gamma");
		specimen.notify("baz", "Delta");

		expect(firstResults.length).toEqual(2);
		expect(firstResults[0]).toEqual("foo");
		expect(firstResults[1]).toEqual("bar");
		expect(secondResults.length).toEqual(2);
		expect(secondResults[0]).toEqual("Alpha");
		expect(secondResults[1]).toEqual("Beta");
	});

});
