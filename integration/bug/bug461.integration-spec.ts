/**
 * @jest-environment jsdom
 */
import { builder, Component } from "cydran";

class ParentComponent extends Component {

	private value: {
		first: string;
	};

	constructor() {
		super(`<div><script type="cydran/region" c:name="body" c:value="m().value"></script></div>`);
		this.value = {
			first: "Some Value"
		};
	}

	public update(): void {
		this.$apply(() => {
			this.value.first = "Some other value";
		});
	}

}

class ChildComponent extends Component {

	private modelValue: string;

	private items: any[];

	constructor() {
		super(`<div><ul c:each="m().items" c:each:mode="generated"><template c:type="empty"><li>{{m().modelValue}}<br />{{v().first}}</li></template><template c:type="item"><div>text</div></template></ul></div>`);
		this.items = [];
		this.modelValue = "Some model value";
	}

	public update(): void {
		this.$apply(() => {
			this.modelValue = "Some other model value";
		});
	}

}

test.skip("v() or m() should be proxied for IMPLICIT component", () => {
	document.body.innerHTML = '<div id="app"></div>';

	builder("#app")
		.build()
		.withInitializer((stage: Stage) => {
			const childComponent: ChildComponent = new ChildComponent();
			const parentComponent: ParentComponent = new ParentComponent();
			parentComponent.setChild("body", childComponent);
			stage.setComponent(parentComponent);

			expect(document.body.innerHTML).toEqual(`<div id="app"><div><div><ul><li><!--#-->Some model value<!--#--><br><!--#-->Some Value<!--#--></li></ul></div></div></div>`);

			parentComponent.update();
			childComponent.update();

			expect(document.body.innerHTML).toEqual(`<div id="app"><div><div><ul><li><!--#-->Some other model value<!--#--><br><!--#-->Some other value<!--#--></li></ul></div></div></div>`);
		})
		.start();

});
