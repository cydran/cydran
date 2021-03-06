import { builder, Stage, Component } from "cydran";

class ChildComponent extends Component {

	constructor() {
		super(`
			<div>
				<p c:id="child-test-element">[["!" + v() + "!"]]</p>
			</div>
		`);
	}

	public get(): string {
		return this.forElement("child-test-element").get().innerHTML;
	}

}

class TestComponent extends Component {

	private testValue: string;

	constructor() {
		super(`
			<div>
				<p c:id="test-element">[["^" + m().testValue + "^"]]</p>
				<script type="cydran/region" c:name="child" c:value="m().testValue"></script>
			</div>
		`);

		this.testValue = "populated";
	}

	public get(): string {
		return this.forElement("test-element").get().innerHTML;
	}

}

test("Value from m() and v() should be available in fixed anonymous expressions", () => {

	builder("body")
		.withInfoLogging()
		.withInitializer((stage: Stage) => {
			const child: ChildComponent = new ChildComponent();
			const component: TestComponent = new TestComponent();
			stage.setComponent(component);
			component.setChild("child", child);
			expect(component.get()).toEqual("<!--#-->^populated^<!--#-->");
			expect(child.get()).toEqual("<!--#-->!populated!<!--#-->");
		})
		.build()
		.start();
});
