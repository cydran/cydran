import { builder } from "cydran";

test("SelectorError should be thrown for no matching elements for root element", () => {
	document.body.innerHTML = '<div>something</div>';

	let thrown: Error = null;

	try {
		builder("#app", {"cydran.logging.level": "WARN", "cydran.startup.synchronous": true}).build().start();
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.message).toEqual("CSS selector MUST identify single HTMLElement: '#app' - 0 found");
});

test("SelectorError should be thrown for multiple matching elements for root element", () => {
	document.body.innerHTML = '<div id="app">first</div><div id="app">first</div>';

	let thrown: Error = null;

	try {
		builder("#app", {"cydran.logging.level": "WARN", "cydran.startup.synchronous": true}).build().start();
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.message).toEqual("CSS selector MUST identify single HTMLElement: '#app' - 2 found");
});
