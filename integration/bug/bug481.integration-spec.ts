import { builder, Stage, Component } from "cydran";

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

const TEMPLATE1 = `<div>
				<select c:each="m().items" c:each:mode="generated" c:model="m().values" size="10" c:id="specimen-element" multiple>
				</select>
			</div>`;
const TEMPLATE2 = `<div>
				<select c:each="m().items" c:each:mode="generated" c:model="m().values" size="10" c:id="specimen-element" multiple>
					<template c:type="item">
						<div></div>
					</template>
				</select>
			</div>`;
const TEMPLATE3 = `<div>
				<select c:each="m().items" c:each:mode="generated" c:model="m().values" size="10" c:id="specimen-element" multiple>
					<div>
						<template c:type="item"></template>
					</div>
				</select>
			</div>`;
const TEMPLATE4 = `<div>
				<select c:each="m().items" c:each:mode="generated" c:model="m().values" size="10" c:id="specimen-element" multiple>
					<template></template>
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

class TestComponent4 extends AbstractTestComponent {
	constructor() {
		super(TEMPLATE4);
	}
}

test("TemplateError SHOULD be thrown if <template c:type='item'> node does not exist in a Cydran 'each' context", () => {
	document.body.innerHTML = '<div id="app">first</div>';

	let thrown: Error = null;

	try {
		builder("body")
			.withInfoLogging()
			.withInitializer((stage: Stage) => {
				const component: TestComponent1 = new TestComponent1();
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

test("TemplateError should NOT be thrown if <template c:type='item'> node DOES exist in a Cydran 'each' context", () => {
	document.body.innerHTML = '<div id="app">first</div>';

	let thrown: Error = null;

	try {
		builder("body")
			.withInfoLogging()
			.withInitializer((stage: Stage) => {
				const component: TestComponent2 = new TestComponent2();
				stage.setComponent(component);
			})
			.build()
			.start();
	} catch (e) {
		thrown = e;
	}
	expect(thrown == null);
});

test("ModuleAffinityError SHOULD be thrown if <template> tag exists but not as a root child in a Cydran 'each' context", () => {
	document.body.innerHTML = '<div id="app">first</div>';

	let thrown: Error = null;

	try {
		builder("body")
			.withInfoLogging()
			.withInitializer((stage: Stage) => {
				const component: TestComponent3 = new TestComponent3();
				stage.setComponent(component);
			})
			.build()
			.start();
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("ModuleAffinityError");
});

test("ModuleAffinityError SHOULD be thrown if <template> tag exists but without proper attributes in a Cydran 'each' context", () => {
	document.body.innerHTML = '<div id="app">first</div>';

	let thrown: Error = null;

	try {
		builder("body")
			.withInfoLogging()
			.withInitializer((stage: Stage) => {
				const component: TestComponent4 = new TestComponent4();
				stage.setComponent(component);
			})
			.build()
			.start();
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("ModuleAffinityError");
});