import Observable from "pattern/Observable";
import ObservableImpl from "pattern/ObservableImpl";

test("Garbage Collection does not retain references", async () => {
	const specimen: Observable<string> = new ObservableImpl<string>();
	const results: string[] = [];

	let callback: (value: string) => void = (value: string) => results.push(value);

	specimen.register(callback);
	specimen.notify("foo");
	specimen.notify("bar");

	callback = null as unknown as (value: string) => void;

	await triggerGc();

	specimen.notify("bat");
	specimen.notify("baz");

	expect(results.length).toEqual(2);
	expect(results[0]).toEqual("foo");
	expect(results[1]).toEqual("bar");
}, 30000);

async function triggerGc() {
	for (let i = 0; i < 10; i++) {
		await (async () => {
			for (let j = 0; j < 1000; j++) {
				const a = new Array(100000);
			}
			await (() => new Promise((resolve) => setTimeout(resolve, 0)))();
		})();
	}
}
