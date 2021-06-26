/**
 * @jest-environment jsdom
 */
 import { builder, Component, Stage, HOOKS } from "cydran";

class EventLogger {

	private log: string[];

	constructor() {
		this.log = [];
		HOOKS.getDigestionCycleStartHooks().add((component) => this.getLog().push("Digested: " + component.getId()));
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


test("Digestion - No element mediators", () => {
	document.body.innerHTML = '<div></div>';

	const stage: Stage = builder("body")
		.withWarnLogging()
		.build();

	stage.start();

	expect(stage.isStarted()).toEqual(true);

	EVENT_LOGGER.reset();
	stage.setComponent(new TestComponent());
	expect(document.body.innerHTML).toEqual("<div>Hello World!</div>");
	expect(EVENT_LOGGER.getLog().length).toEqual(1);
	expect(EVENT_LOGGER.getLog()[0]).toEqual("Digested: 0-0-1");
});
