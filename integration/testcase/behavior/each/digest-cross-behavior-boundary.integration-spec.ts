import { Component } from 'cydran';
import Harness from '../../../Harness';

const TEMPLATE: string = `<div>
	<button c-onclick="m().changeValue()">Click Me</button>
	<ul c-each="m().items">
		<template c-type="item">
			<li data-testid="{{v().id}}">
				{{v().name}}
			</li>
		</template>
	</ul>
</div>`;

class TestComponent extends Component {

	private items: {
		id: string,
		name: string
	}[];

	constructor() {
		super(TEMPLATE);
		this.items = [
			{
				id: "1",
				name: "One"
			},
			{
				id: "2",
				name: "Two"
			},
			{
				id: "3",
				name: "Three"
			}
		];
	}

	public changeValue(): void {
		this.items[1].name = "Dos";
	}

}

test("Behaviors / Each / Basic list composition", () => {
	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent()).start();

	harness.forTestId("1").expect().trimmedTextContent().toEqual("One");
	harness.forTestId("2").expect().trimmedTextContent().toEqual("Two");
	harness.forTestId("3").expect().trimmedTextContent().toEqual("Three");

	harness.forText("Click Me").get().click();

	harness.forTestId("1").expect().trimmedTextContent().toEqual("One");
	harness.forTestId("2").expect().trimmedTextContent().toEqual("Dos");
	harness.forTestId("3").expect().trimmedTextContent().toEqual("Three");
});
