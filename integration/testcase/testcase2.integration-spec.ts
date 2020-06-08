import { builder, Stage, Component, HOOKS } from "cydran";

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

class TestComponent extends Component {

	constructor() {
		super("<div>Hello World!</div>");
	}

}

test("Testcase should pass", () => {

	document.body.innerHTML = '<div></div>'

	builder("body")
		.withWarnLogging()
		.withInitializer((stage: Stage) => {
			stage.setComponent(new TestComponent());
			expect(document.body.innerHTML).toEqual("<div>Hello World!</div>");
			stage.dispose();
		})
		.build()
		.start();

	window.document.dispatchEvent(new Event("DOMContentLoaded", {
		bubbles: true,
		cancelable: true
	}));

});
