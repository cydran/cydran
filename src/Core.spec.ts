import { assert } from "chai";
import { JSDOM } from "jsdom";
import { describe, it } from "mocha";
import { Component, Properties } from "./Core";

Properties.setWindow(new JSDOM("<html></html>").window);

class TestComponent extends Component {

	private barCount: number;

	private bazCount: number;

	constructor() {
		super("testComponent", "<div></div>");
		this.barCount = 0;
		this.bazCount = 0;
		this.listenTo("foo", "bar", this.onBar);
		this.listenTo("foo", "baz", this.onBaz);
	}

	public onBar(): void {
		this.barCount++;
	}

	public onBaz(): void {
		this.bazCount++;
	}

	public getBarCount(): number {
		return this.barCount;
	}

	public getBazCount(): number {
		return this.bazCount;
	}

}

describe("Component tests", () => {

	it("Correct listeners executed", () => {
		const component: TestComponent = new TestComponent();
		component.message("foo", "bar", {});
		component.message("foo", "bar", {});
		component.message("foo", "baz", {});
		component.message("foo", "baz", {});

		assert.equal(component.getBarCount(), 2);
		assert.equal(component.getBazCount(), 2);
	});

});
