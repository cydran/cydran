import { builder, Stage, Component } from "cydran";
import { StageImpl } from "@/Component";

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

const HTML: string = "html";

test("ModuleAffinityError thrown if <template pfx:type='item'> tag NOT exists in a Cydran 'each' context", () => {
	let thrown = null;
	try {
		const wkStage: StageImpl = new StageImpl(HTML);
		wkStage.setComponent(new TestComponent1());
	} catch (e) {
		thrown = e;
		console.error(e);
	}
	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("ModuleAffinityError");
});

/*
test("No thrown error if <template pfx:type='item'> tag exists in a Cydran 'each' context", () => {
	let thrown = null;
	try {
		const wkStage: StageImpl = new StageImpl(HTML);
		wkStage.setComponent(new TestComponent2());
	} catch (e) {
		thrown = e;
	}
	expect(null === thrown);
});

test("ModuleAffinityError thrown if <template pfx:type='item'> tag NOT immediate child of Cydran 'each' context", () => {
	let thrown = null;
	try {
		const wkStage: StageImpl = new StageImpl(HTML);
		wkStage.setComponent(new TestComponent3());
	} catch (e) {
		console.error(e);
		thrown = e;
	}
	expect(thrown).not.toBeNull();
	expect(thrown.name).toEqual("ModuleAffinityError");
});
*/