import { Component } from "@cydran/cydran";
import { Harness } from "@cydran/testsupport";
import { describe, expect, test } from "@jest/globals";

const TEMPLATE: string = `<ul c-each="m().items">
	<template c-type="item">
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

describe("Behavior / Each", () => {

	test("Basic list composition", () => {
		const harness: Harness<TestComponent> = new Harness<TestComponent>(() => new TestComponent()).start();

		const EXPECTED: string = `<html lang="en"><head><style id="cydran-styles">
/*
 * Cydran CSS Styles
 */
</style>
		<title>Cydran Test Harness</title>
	</head>
	<body><!--SS--><!--SE--><ul><li data-testid="1">
			<!--#-->One<!--#-->
		</li><li data-testid="2">
			<!--#-->Two<!--#-->
		</li><li data-testid="3">
			<!--#-->Three<!--#-->
		</li></ul><!--SS--><!--SE--></body></html>`;

		expect(harness.getDocument().documentElement.outerHTML).toEqual(EXPECTED);
	});

});
