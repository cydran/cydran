/**
 * @jest-environment jsdom
 */
import { builder, Component, Stage } from "cydran";
interface Item {
	id: string;
	value: string;
}

abstract class AbstractTestComponent extends Component {

	protected items: Item[];

	protected values: string[];

	constructor(template) {
		super(template);

		this.values = ["2", "4"];

		this.items = [{
			id: "1",
			value: "One"
		}, {
			id: "2",
			value: "Two"
		}, {
			id: "3",
			value: "Three"
		}, {
			id: "4",
			value: "Four"
		}];
	}

}

document.body.innerHTML = '<div id="app"></div>';

const TEMPLATE1 = `<div>
				<select c-each="m().items" c-each-mode="generated" c-model="m().values">
				</select>
			</div>`;
const TEMPLATE2 = `<div>
				<select c-each="m().items" c-each-mode="generated" c-model="m().values">
					<template c-type="item">
						<div></div>
					</template>
				</select>
			</div>`;
const TEMPLATE3 = `<div>
				<select c-each="m().items" c-each-mode="generated" c-model="m().values">
					<div>
						<template c-type="item">
							<div></div>
						</template>
					</div>
				</select>
			</div>`;

class TestComponent1 extends AbstractTestComponent {
	constructor() {
		super(TEMPLATE1);
	}
}

class TestComponent2 extends AbstractTestComponent {
	constructor() {
		super(TEMPLATE2);
	}
}

class TestComponent3 extends AbstractTestComponent {
	constructor() {
		super(TEMPLATE3);
	}
}


test("TemplateError thrown if <template pfx:type='item'> tag NOT exists in a Cydran 'each'", () => {
	let thrown = null;

	try {
		const stage: Stage = builder("#app", {"cydran.logging.level": "WARN"}).build();
		stage.start();
		stage.setComponent(new TestComponent1());
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.message).toEqual("Element with attribute c-each is invalid:\n\t- must have only one child <template c-type=\"item\"> node/element.\n");
});

test("No thrown error if <template pfx:type='item'> tag exists in a Cydran 'each'", () => {
	let thrown = null;

	try {
		const stage: Stage = builder("#app", {"cydran.logging.level": "WARN"}).build();
		stage.start();
		stage.setComponent(new TestComponent2());
	} catch (e) {
		thrown = e;
		console.error(e);
	}

	expect(thrown).toBeNull();
});
