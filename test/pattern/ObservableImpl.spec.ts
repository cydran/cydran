import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";

test("Garbage Collection does not retain references with single argument", async () => {
	const specimen: Observable<string> = new ObservableImpl<string>();
	const results: string[] = [];

	let callback: (value: string) => void = (value: string) => results.push(value);

	specimen.register(callback);
	specimen.notify("foo");
	specimen.notify("bar");

	callback = null as unknown as (value: string) => void;

	await triggerGarbageCollection();

	specimen.notify("bat");
	specimen.notify("baz");

	expect(results.length).toEqual(2);
	expect(results[0]).toEqual("foo");
	expect(results[1]).toEqual("bar");
}, 30000);

test("Garbage Collection does not retain references with multiple arguments", async () => {
	const specimen: Observable<string> = new ObservableImpl<string>();
	const firstResults: string[] = [];
	const secondResults: string[] = [];

	let callback: (first: string, second: string) => void = (first: string, second: string) => {
		firstResults.push(first);
		secondResults.push(second);
	};

	specimen.register(callback);
	specimen.notify("foo", "Alpha");
	specimen.notify("bar", "Beta");

	callback = null as unknown as (value: string) => void;

	await triggerGarbageCollection();

	specimen.notify("bat", "Gamma");
	specimen.notify("baz", "Delta");

	expect(firstResults.length).toEqual(2);
	expect(firstResults[0]).toEqual("foo");
	expect(firstResults[1]).toEqual("bar");

	expect(secondResults.length).toEqual(2);
	expect(secondResults[0]).toEqual("Alpha");
	expect(secondResults[1]).toEqual("Beta");
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
