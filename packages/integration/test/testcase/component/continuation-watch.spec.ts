import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from '@jest/globals';

// A watch registered through $c() takes no target: the named method is resolved on, and called with
// `this` bound to, the component. An optional reducer is applied with reducedBy().

const TEMPLATE: string = `<div>
	<p data-testid="count">{{m().count}}</p>
	<button c-onclick="m().bump()">Bump</button>
</div>`;

class TestComponent extends Component {

	public count: number;

	public seen: number[];

	public reduced: string[];

	public receiver: unknown;

	constructor() {
		super(TEMPLATE);
		this.count = 0;
		this.seen = [];
		this.reduced = [];
		this.receiver = null;
		this.$c().onExpressionValueChange("m().count").invoke("onCount");
		this.$c().onExpressionValueChange("m().count").reducedBy((value: unknown) => "n" + value).invoke("onReduced");
	}

	public onCount(previous: number, current: number): void {
		this.receiver = this;
		this.seen.push(current);
	}

	public onReduced(previous: string, current: string): void {
		this.reduced.push(current);
	}

	public bump(): void {
		this.count++;
	}

}

describe("Continuation watch", () => {

	test("calls the component's named method with the component as this", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.start();
		const component: TestComponent = harness.getComponent();

		harness.forText("Bump").get().click();
		harness.forText("Bump").get().click();

		harness.forTestId("count").expect().textContent().toEqual("2");
		expect(component.seen[component.seen.length - 1]).toEqual(2);
		expect(component.receiver).toBe(component);
	});

	test("applies the reducer given to reducedBy", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent());
		harness.start();
		const component: TestComponent = harness.getComponent();

		harness.forText("Bump").get().click();

		expect(component.reduced[component.reduced.length - 1]).toEqual("n1");
	});

});
