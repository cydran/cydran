import { builder, Ids, Stage, Component } from 'cydran';
import Harness from '../../../Harness';

const TEMPLATE: string = `<ul c:each="m().items">
	<template c:type="item">
		<li data-testid="{{v().id}}">
			{{v().name}}
		</li>
	</template>
</ul>`;

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

}

test("Behaviors / Each / Basic list composition", () => {
	const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent()).start();

	const EXPECTED: string = `<html lang="en"><head>
		<title>Cydran Test Harness</title>
	</head>
	<body><ul><li data-testid="1">
			<!--#-->One<!--#-->
		</li><li data-testid="2">
			<!--#-->Two<!--#-->
		</li><li data-testid="3">
			<!--#-->Three<!--#-->
		</li></ul></body></html>`;

	expect(harness.getDocument().documentElement.outerHTML).toEqual(EXPECTED);
});
