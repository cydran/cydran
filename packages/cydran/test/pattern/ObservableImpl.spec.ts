import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";
import { test, expect, describe } from '@jest/globals';
import gc from "expose-gc/function";

// NOTE - These two test cases (single and multiple) are stuffed into the same test due to triggering
// garbage collection in two different tests seems to consistently and spectacularly fail.

describe("ObservableImpl", () => {

	test("Garbage Collection does not retain references with single and multiple arguments", () => {
		const singleSpecimen: Observable = new ObservableImpl();
		const multipleSpecimen: Observable = new ObservableImpl();
		const singleResults: string[] = [];
		const multipleFirstResults: string[] = [];
		const multipleSecondResults: string[] = [];

		let singleCallback: (value: string) => void = (value: string) => singleResults.push(value);
		let multipleCallback: (first: string, second: string) => void = (first: string, second: string) => {
			multipleFirstResults.push(first);
			multipleSecondResults.push(second);
		};

		singleSpecimen.register({}, singleCallback);
		singleSpecimen.notify("foo");
		singleSpecimen.notify("bar");
		multipleSpecimen.register({}, multipleCallback);
		multipleSpecimen.notify("foo", "Alpha");
		multipleSpecimen.notify("bar", "Beta");

		singleCallback = null as unknown as (value: string) => void;
		multipleCallback = null as unknown as (value: string) => void;

		gc();

		singleSpecimen.notify("bat");
		singleSpecimen.notify("baz");
		multipleSpecimen.notify("bat", "Gamma");
		multipleSpecimen.notify("baz", "Delta");

		console.log(singleResults);

		expect(singleResults.length).toEqual(2);
		expect(singleResults[0]).toEqual("foo");
		expect(singleResults[1]).toEqual("bar");
		expect(multipleFirstResults.length).toEqual(2);
		expect(multipleFirstResults[0]).toEqual("foo");
		expect(multipleFirstResults[1]).toEqual("bar");
		expect(multipleSecondResults.length).toEqual(2);
		expect(multipleSecondResults[0]).toEqual("Alpha");
		expect(multipleSecondResults[1]).toEqual("Beta");
	});

});
