import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";

// NOTE - These two test cases (single and multiple) are stuffed into the same test due to triggering
// garbage collection in two different tests seems to consistently and spectacularly fail.

test.skip("Garbage Collection does not retain references with single and multiple arguments", async () => {
	const singleSpecimen: Observable<string> = new ObservableImpl<string>();
	const multipleSpecimen: Observable<string> = new ObservableImpl<string>();
	const singleResults: string[] = [];
	const multipleFirstResults: string[] = [];
	const multipleSecondResults: string[] = [];

	let singleCallback: (value: string) => void = (value: string) => singleResults.push(value);
	let multipleCallback: (first: string, second: string) => void = (first: string, second: string) => {
		multipleFirstResults.push(first);
		multipleSecondResults.push(second);
	};

	singleSpecimen.register(singleCallback);
	singleSpecimen.notify("foo");
	singleSpecimen.notify("bar");
	multipleSpecimen.register(multipleCallback);
	multipleSpecimen.notify("foo", "Alpha");
	multipleSpecimen.notify("bar", "Beta");

	singleCallback = null as unknown as (value: string) => void;
	multipleCallback = null as unknown as (value: string) => void;

	await triggerGarbageCollection();

	singleSpecimen.notify("bat");
	singleSpecimen.notify("baz");
	multipleSpecimen.notify("bat", "Gamma");
	multipleSpecimen.notify("baz", "Delta");

	expect(singleResults.length).toEqual(2);
	expect(singleResults[0]).toEqual("foo");
	expect(singleResults[1]).toEqual("bar");
	expect(multipleFirstResults.length).toEqual(2);
	expect(multipleFirstResults[0]).toEqual("foo");
	expect(multipleFirstResults[1]).toEqual("bar");
	expect(multipleSecondResults.length).toEqual(2);
	expect(multipleSecondResults[0]).toEqual("Alpha");
	expect(multipleSecondResults[1]).toEqual("Beta");
}, 30000);

async function triggerGarbageCollection() {
	for (let i = 0; i < 20; i++) {
		await (async () => {
			for (let j = 0; j < 1000; j++) {
				const a = new Array(100000);
			}

			await (() => new Promise((resolve) => setTimeout(resolve, 0)))();
		})();
	}
}
