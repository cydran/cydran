import { builder, Stage, Component } from "cydran";

interface Item {

	id: string;

	value: string;

}

class TestComponent extends Component {

	private items: Item[];

	private values: string[];

	constructor() {
		super(`
			<div>
				<select c:each="m().items" c:each:mode="generated" c:model="m().values" size="10" c:id="specimen-element" multiple>
				</select>
			</div>
		`);

		this.values = ["2", "4"];

		this.items = [
			{
				id: "1",
				value: "One"
			},
			{
				id: "2",
				value: "Two"
			},
			{
				id: "3",
				value: "Three"
			},
			{
				id: "4",
				value: "Four"
			}
		];
	}

}

test("Template error should be thrown if <template> node does not exist in a Cydran 'each' context", () => {
	document.body.innerHTML = '<div id="app">first</div>';

	let thrown: Error = null;

	try {
		builder("body")
			.withInfoLogging()
			.withInitializer((stage: Stage) => {
				const component: TestComponent = new TestComponent();
				stage.setComponent(component);
			})
			.build()
			.start();
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("TemplateError");
	expect(thrown.message).toEqual("SELECT element with a c:each attribute must have at least one child <template> node/element.");
});
