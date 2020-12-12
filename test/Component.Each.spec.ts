import { Component } from "Component";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

const testPrefix: string = "prefix";
const testModelFn: Function = () => { /**/ };
const testItem: Object = {};

const doc = new JSDOM(`
	<div id="whack" c:each="m().data" c:each:mode="none">
		<template c:type="item><div/></template>
		<script type="cydran/region" c:name="xyz"></script>
	</div>
	`).window.document;

class SimpleComponent extends Component {
	constructor(template: string, options?: ComponentOptions) {
		super(template, options);
	}
}

const dependencies: ElementMediatorDependencies = {
	el: doc.querySelector("div"),
	expression: "true",
	model: {'data': [
		{'id': 0, 'name': 'zero'},
		{'id': 1, 'name': 'one'},
		{'id': 2, 'name': 'two'},
		{'id': 3, 'name': 'three'},
		{'id': 4, 'name': 'four'}
	]
	},
	mvvm: mock(MvvmImpl),
	parent: null,
	prefix: "prefix",
	module: null
};

test("Each construtor - null dependencies", () => {
	assertNullGuarded("dependencies", () => new Each(null));
});

test("Each construtor - with dependencies", () => {
	const emed = new Each(dependencies);
	expect(emed).not.toBeNull();
});

test.skip("wire()", () => {
	const emed = new Each(dependencies);
	expect(emed).not.toBeNull();
	emed.wire();
});

test("unwire()", () => {
	const emed = new Each(dependencies);
	const spyemed = spy(emed);
	expect(emed).not.toBeNull();
	emed.unwire();
	verify(spyemed.unwire()).once();
});