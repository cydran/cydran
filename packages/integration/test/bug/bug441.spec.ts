import { Component, Stage, StageImpl } from "@cydran/cydran";
import { describe, test, expect } from '@jest/globals';
class ChildComponent extends Component {

	constructor() {
		super(`
			<div>
				<p c-id="child-test-element">[["!" + v() + "!"]]</p>
			</div>
		`);
	}

	public get(): string {
		return this.$c().forElement("child-test-element").get().innerHTML;
	}

}

class TestComponent extends Component {

	private testValue: string;

	constructor() {
		super(`
			<div>
				<p c-id="test-element">[["^" + m().testValue + "^"]]</p>
				<c-region c-region-name="child" c-region-value="m().testValue"></c-region>
			</div>
		`);

		this.testValue = "populated";
	}

	public get(): string {
		return this.$c().forElement("test-element").get().innerHTML;
	}

}

describe.skip("Bug 441", () => {

	test("Value from m() and v() should be available in fixed anonymous expressions", () => {
		const stage: Stage = new StageImpl("body", { "cydran.logging.level": "WARN" });
		stage.addInitializer((stage: Stage) => {
			const child: ChildComponent = new ChildComponent();
			const component: TestComponent = new TestComponent();
			stage.setComponent(component);
			component.$c().regions().set("child", child);
			expect(component.get()).toEqual("<!--#-->^populated^<!--#-->");
			expect(child.get()).toEqual("<!--#-->!populated!<!--#-->");
		});
		stage.start();
	});

});
