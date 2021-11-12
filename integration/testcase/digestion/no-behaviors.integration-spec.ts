 import { Component } from "cydran";
 import Harness from "../../Harness";

class EventLogger {

	private log: string[];

	constructor() {
		this.log = [];
		// HOOKS.getDigestionCycleStartHooks().add((component) => this.getLog().push("Digested: " + component.getId()));
	}

	public reset(): void {
		this.log = [];
	}

	protected logEvent(text: string): void {
		this.log.push(text);
	}

	public getLog(): string[] {
		return this.log;
	}

}

const EVENT_LOGGER: EventLogger = new EventLogger();

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

test.skip("Digestion - No behaviors", () => {
	document.body.innerHTML = '<div></div>';

	EVENT_LOGGER.reset();
	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());

	expect(harness.getDocument().body.innerHTML).toEqual("<div>Hello World!</div>");
	expect(EVENT_LOGGER.getLog().length).toEqual(0);
});
