import { assertNullGuarded } from "./TestUtils";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { JSDOM } from 'jsdom';
import Component from 'component/Component';
import ComponentOptions from 'component/ComponentOptions';
import ElementMediatorDependencies from 'mediator/ElementMediatorDependencies';
import Each from 'mediator/core/Each';
import ElementMediator from 'mediator/ElementMediator';

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
	model: {
		'data': [
			{ 'id': 0, 'name': 'zero' },
			{ 'id': 1, 'name': 'one' },
			{ 'id': 2, 'name': 'two' },
			{ 'id': 3, 'name': 'three' },
			{ 'id': 4, 'name': 'four' }
		]
	},
	parent: null,
	prefix: "prefix",
	module: null,
	mediatorPrefix: "c",
	validated: false,
	mutable: true
};

function createMediator(): ElementMediator<any, any, any> {
	const specimen: ElementMediator<any, any, any> = new Each();
	specimen.tell("init", dependencies);

	return specimen;
}

test("Each construtor - with dependencies", () => {
	const emed = createMediator();
	expect(emed).not.toBeNull();
});
