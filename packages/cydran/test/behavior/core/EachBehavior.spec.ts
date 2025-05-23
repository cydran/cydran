import GlobalContextImpl from 'context/GlobalContextImpl';
import { JSDOM } from 'jsdom';
import Component from 'component/Component';
import ComponentOptions from 'component/ComponentOptions';
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import EachBehavior from 'behavior/core/EachBehavior';
import Behavior from 'behavior/Behavior';
import BehaviorTransitions from 'behavior/BehaviorTransitions';
import { describe, expect, test } from '@jest/globals';

const testPrefix: string = "prefix";
const testModelFn: Function = () => { /**/ };
const testItem: Object = {};

const doc = new JSDOM(`
	<div id="whack" c:each="m().data" c:each:mode="none">
		<template c:type="item><div/></template>
		<c-region c:name="xyz"></c-region>
	</div>
	`).window.document;

class SimpleComponent extends Component {
	constructor(template: string, options?: ComponentOptions) {
		super(template, options);
	}
}

const dependencies: BehaviorDependencies = {
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
	behaviorPrefix: "c",
	validated: false,
	mutable: true
};

function createBehavior(): Behavior<any, any, any> {
	const specimen: Behavior<any, any, any> = new EachBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);

	return specimen;
}

describe("EachBehavior", () => {

	test("Each constructor - with dependencies", () => {
		expect(GlobalContextImpl).not.toBeUndefined();
		const emed = createBehavior();
		expect(emed).not.toBeNull();
	});

});