import { Component } from "cydran";
import Harness from '../Harness';

const PARENT_TEMPLATE: string = `<div>
	<script type="cydran/region" c-region-name="body" c-region-value="m().value"></script>
	<p data-testid="parent">{{m().value.first}}</p>
	<button c-onclick="m().update()">Change Parent</button>
</div>`;

const CHILD_TEMPLATE: string = `<div>
	<ul c-each="m().items2" c-each-mode="generated">
		<template c-type="empty">
			<li>
				<p data-testid="empty-implicit-m-value">{{m().value}}</p>
				<p data-testid="empty-implicit-v-first">{{v().first}}</p>
			</li>
		</template>
		<template c-type="item">
			<p>Placeholder</p>
		</template>
	</ul>
	<ul c-each="m().items2" c-each-mode="generated">
		<template c-type="empty" c-component="emptyExplicit"></template>
		<template c-type="item">
			<p>Placeholder</p>
		</template>
	</ul>
	<ul c-each="v().items" c-each-mode="generated">
		<template c-type="first">
			<li>
				<p data-testid="first-implicit-m-value">{{m().value}}</p>
				<p data-testid="first-implicit-v-first">{{v().first}}</p>
			</li>
		</template>
		<template c-type="last">
			<li>
				<p data-testid="last-implicit-m-value">{{m().value}}</p>
				<p data-testid="last-implicit-v-first">{{v().first}}</p>
			</li>
		</template>
		<template c-type="item">
			<li data-testid="item-implicit-v-name">{{v().name}}</li>
		</template>
		<template c-type="alt" c-test="v().id == '2'">
			<li data-testid="alt-implicit-v-name">{{v().name}}</li>
		</template>
	</ul>
	<ul c-each="v().items" c-each-mode="generated">
		<template c-type="first" c-component="firstExplicit"></template>
		<template c-type="last" c-component="lastExplicit"></template>
		<template c-type="item" c-component="itemExplicit"></template>
		<template c-type="alt" c-component="altExplicit" c-test="v().id == '2'"></template>
	</ul>
	<p data-testid="child">{{v().first}}</p>
	<button c-onclick="m().update()">Change Child</button>
</div>`;

interface Item {

	id: string;

	name: string;

}

interface Value {

	first: string;

	items: Item[];

}

class AbstractExplicitComponent extends Component {

	private value: string;

	constructor(type: string) {
		super(`<li>
			<p data-testid="${type}-explicit-m-value">{{m().value}}</p>
			<p data-testid="${type}-explicit-v-first">{{v().first}}</p>
		</li>`);
		this.value = type + "-Zeta";
	}

}

class AbstractItemExplicitComponent extends Component {

	constructor(type: string) {
		super(`<li data-testid="${type}-explicit-v-name">{{v().name}}</li>`);
	}

}

class ItemExplicitComponent extends AbstractItemExplicitComponent {

	constructor() {
		super("item");
	}

}

class AltExplicitComponent extends AbstractItemExplicitComponent {

	constructor() {
		super("alt");
	}

}

class EmptyExplicitComponent extends AbstractExplicitComponent {

	constructor() {
		super("empty");
	}

}

class FirstExplicitComponent extends AbstractExplicitComponent {

	constructor() {
		super("first");
	}

}

class LastExplicitComponent extends AbstractExplicitComponent {

	constructor() {
		super("last");
	}

}

class ParentComponent extends Component {

	private value: Value;

	constructor() {
		super(PARENT_TEMPLATE);
		this.value = {
			first: "Alpha",
			items: [
				{
					id: "1",
					name: "Beta"
				},
				{
					id: "2",
					name: "Gamma"
				}
			]
		};
	}

	public update(): void {
		this.value.first = "Delta";
		this.value.items[0].name = "Eta";
		this.value.items[1].name = "Theta";
	}

}

class ChildComponent extends Component {

	private value: string;

	private items: Item[];

	constructor() {
		super(CHILD_TEMPLATE);
		this.value = "Iota";
		this.items = [];
	}

	public update(): void {
		this.value = "Kappa";
	}

}

test("v() or m() should be proxied for IMPLICIT component", () => {
	const harness: Harness<ParentComponent> = new Harness<ParentComponent>(() => new ParentComponent());
	harness.registerPrototype("firstExplicit", FirstExplicitComponent);
	harness.registerPrototype("lastExplicit", LastExplicitComponent);
	harness.registerPrototype("emptyExplicit", EmptyExplicitComponent);
	harness.registerPrototype("itemExplicit", ItemExplicitComponent);
	harness.registerPrototype("altExplicit", AltExplicitComponent);
	harness.start();

	const childComponent: ChildComponent = new ChildComponent();
	harness.getComponent().setChild("body", childComponent);

	harness.forTestId("parent").expect().textContent().toEqual("Alpha");
	harness.forTestId("child").expect().textContent().toEqual("Alpha");
	harness.forTestId("empty-implicit-m-value").expect().textContent().toEqual("Iota");
	harness.forTestId("empty-implicit-v-first").expect().textContent().toEqual("Alpha");
	harness.forTestId("first-implicit-m-value").expect().textContent().toEqual("Iota");
	harness.forTestId("first-implicit-v-first").expect().textContent().toEqual("Alpha");
	harness.forTestId("last-implicit-m-value").expect().textContent().toEqual("Iota");
	harness.forTestId("last-implicit-v-first").expect().textContent().toEqual("Alpha");
	harness.forTestId("item-implicit-v-name").expect().textContent().toEqual("Beta");
	harness.forTestId("alt-implicit-v-name").expect().textContent().toEqual("Gamma");
	harness.forTestId("empty-explicit-m-value").expect().textContent().toEqual("empty-Zeta");
	harness.forTestId("empty-explicit-v-first").expect().textContent().toEqual("");
	harness.forTestId("first-explicit-m-value").expect().textContent().toEqual("first-Zeta");
	harness.forTestId("first-explicit-v-first").expect().textContent().toEqual("");
	harness.forTestId("last-explicit-m-value").expect().textContent().toEqual("last-Zeta");
	harness.forTestId("last-explicit-v-first").expect().textContent().toEqual("");
	harness.forTestId("item-explicit-v-name").expect().textContent().toEqual("Beta");
	harness.forTestId("alt-explicit-v-name").expect().textContent().toEqual("Gamma");
	harness.forText("Change Parent").get().click();
	harness.forText("Change Child").get().click();
	harness.forTestId("parent").expect().textContent().toEqual("Delta");
	harness.forTestId("child").expect().textContent().toEqual("Delta");
	harness.forTestId("empty-implicit-m-value").expect().textContent().toEqual("Kappa");
	harness.forTestId("empty-implicit-v-first").expect().textContent().toEqual("Delta");
	harness.forTestId("first-implicit-m-value").expect().textContent().toEqual("Kappa");
	harness.forTestId("first-implicit-v-first").expect().textContent().toEqual("Delta");
	harness.forTestId("last-implicit-m-value").expect().textContent().toEqual("Kappa");
	harness.forTestId("last-implicit-v-first").expect().textContent().toEqual("Delta");
	harness.forTestId("item-implicit-v-name").expect().textContent().toEqual("Eta");
	harness.forTestId("alt-implicit-v-name").expect().textContent().toEqual("Theta");
	harness.forTestId("empty-explicit-m-value").expect().textContent().toEqual("empty-Zeta");
	harness.forTestId("empty-explicit-v-first").expect().textContent().toEqual("");
	harness.forTestId("first-explicit-m-value").expect().textContent().toEqual("first-Zeta");
	harness.forTestId("first-explicit-v-first").expect().textContent().toEqual("");
	harness.forTestId("last-explicit-m-value").expect().textContent().toEqual("last-Zeta");
	harness.forTestId("last-explicit-v-first").expect().textContent().toEqual("");
	harness.forTestId("item-explicit-v-name").expect().textContent().toEqual("Eta");
	harness.forTestId("alt-explicit-v-name").expect().textContent().toEqual("Theta");
});
