import { Component, Stage, StageImpl } from "@cydran/cydran";
import { describe, test, expect } from '@jest/globals';

function reduce(input): string {
	return (input + "")
		.replace(/\n/g, "")
		.replace(/\t/g, "")
		.replace(/<!--#-->/g, "");
}

const EXPECTED_BEFORE: string = `<ul><li>Alpha<button>Click Me</button></li><li>Beta<button>Click Me</button></li><li>Gamma<button>Click Me</button></li></ul>`;
const EXPECTED_AFTER: string = `<ul><li>Beta<button>Click Me</button></li><li>Gamma<button>Click Me</button></li></ul>`;

interface Item {

	id: string;

	name: string;

}

const children: ChildComponent[] = [];

class ChildComponent extends Component {

	constructor() {
		super(`
			<li>
				{{v().name}}
				<button c-onclick="m().findMe()">Click Me</button>
			</li>
		`);
	}

	public findMe(): void {
		children.push(this);
	}

	public kill(): void {
		this.$c().getParent()["killChild"](this.$c().getValue());
		this.$c().sync();
	}

}

class TestComponent extends Component {

	private items: Item[];

	constructor() {
		super(`
			<div>
				<ul c-each="m().items" c-each-mode="none">
					<template c-type="item" c-component="childItem"></template>
				</ul>
			</div>
		`);

		this.items = [
			{
				id: "1",
				name: "Alpha"
			},
			{
				id: "2",
				name: "Beta"
			},
			{
				id: "3",
				name: "Gamma"
			}
		];
	}

	public killChild(item: Item): void {
		const removeIdx = this.items.indexOf(item);

		if (removeIdx > -1) {
			this.items.splice(removeIdx, 1);
		}
	}

}

describe.skip("Bug 357", () => {

	test("Exception should not be thrown when removing an item from an each", () => {
		const stage: Stage = new StageImpl("body", { "cydran.logging.level": "WARN" });
		stage.getContext().registerPrototype("childItem", ChildComponent);
		stage.addInitializer((stage: Stage) => {
			const component: Component = new TestComponent();
			stage.setComponent(component);
			expect(reduce(component.$c().getEl().innerHTML)).toEqual(EXPECTED_BEFORE);
			component.$c().getEl().querySelector("button").click();
			children[0].kill();
			expect(reduce(component.$c().getEl().innerHTML)).toEqual(EXPECTED_AFTER);
			stage.$release();
		});

		stage.start();
	});

});
