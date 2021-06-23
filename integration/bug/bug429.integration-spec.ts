/**
 * @jest-environment jsdom
 */
import { builder, Component, Stage } from "cydran";

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
					<template c:type="item">
						<option value="{{v().id}}">{{v().value}}</option>
					</template>
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

	public get(): string {
		return this.forElement("specimen-element").get().innerHTML;
	}

	public getElement(): HTMLSelectElement {
		return this.forElement("specimen-element").get();
	}

}

test("Value from m() and v() should be available in fixed anonymous expressions", () => {

	builder("body")
		.withInfoLogging()
		.withInitializer((stage: Stage) => {
			const component: TestComponent = new TestComponent();
			stage.setComponent(component);
			expect(component.get()).toEqual('<option value="1"><!--#-->One<!--#--></option><option value="2"><!--#-->Two<!--#--></option><option value="3"><!--#-->Three<!--#--></option><option value="4"><!--#-->Four<!--#--></option>');

			for (let i: number = 0; i < component.getElement().childNodes.length; i++) {
				const child: HTMLOptionElement = component.getElement().childNodes[i];
				expect(child.tagName.toLowerCase()).toEqual("option");

				if (child.value === "1" || child.value === "3") {
					expect(child.selected).toBeFalsy();
				}

				if (child.value === "2" || child.value === "4") {
					expect(child.selected).toBeTruthy();
				}
			}
		})
		.build()
		.start();
});
