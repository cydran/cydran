import { StageImpl, Stage } from 'cydran';

test.skip("SelectorError should be thrown for no matching elements for root element", () => {
	document.body.innerHTML = '<div>something</div>';

	let thrown: Error = null;

	try {
		const stage: Stage = new StageImpl("#app", {"cydran.logging.level": "WARN", "cydran.startup.synchronous": true});
		stage.start();
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.message).toEqual("CSS selector MUST identify single HTMLElement: '#app' - 0 found");
});

test.skip("SelectorError should be thrown for multiple matching elements for root element", () => {
	document.body.innerHTML = '<div id="app">first</div><div id="app">first</div>';

	let thrown: Error = null;

	try {
		const stage: Stage = new StageImpl("#app", {"cydran.logging.level": "WARN", "cydran.startup.synchronous": true});
		stage.start();
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.message).toEqual("CSS selector MUST identify single HTMLElement: '#app' - 2 found");
});
