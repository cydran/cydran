import { builder, Component, reset } from "Component";
import { Stage } from "Interfaces";

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
				<select c:each="m().items" c:each:mode="generated" c:model="m().values">
				</select>
			</div>`;
const TEMPLATE2 = `<div>
				<select c:each="m().items" c:each:mode="generated" c:model="m().values">
					<template c:type="item">
						<div></div>
					</template>
				</select>
			</div>`;
const TEMPLATE3 = `<div>
				<select c:each="m().items" c:each:mode="generated" c:model="m().values">
					<div>
						<template c:type="item">
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


test("TemplateError thrown if <template pfx:type='item'> tag NOT exists in a Cydran 'each' context", () => {
	reset();

	let thrown = null;

	try {
		const stage: Stage = builder("#app").build();
		stage.start();
		stage.setComponent(new TestComponent1());
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("TemplateError");
	expect(thrown.message).toEqual("The template structure for an Each structure is incorrect or incomplete");
});

test("No thrown error if <template pfx:type='item'> tag exists in a Cydran 'each' context", () => {
	reset();

	let thrown = null;

	try {
		const stage: Stage = builder("#app").build();
		stage.start();
		stage.setComponent(new TestComponent2());
	} catch (e) {
		thrown = e;
		console.error(e);
	}

	expect(thrown).toBeNull();
});
