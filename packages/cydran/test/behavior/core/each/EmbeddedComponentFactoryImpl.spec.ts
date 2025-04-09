import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import { Context } from 'context/Context';
import GlobalContextImpl from 'context/GlobalContextImpl';
import { defaulted } from 'util/Utils';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';

class TestComponent extends Component {

	constructor(template: string, options: ComponentOptions) {
		super(template, defaulted(options, {}));
	}

}

const componentId: string = "testcomponent";
const TEST: string = "test";

function context(): Context {
	const wkContext: Context = new GlobalContextImpl().createChild();
	wkContext.registerPrototype(componentId, TestComponent);
	return wkContext;
}

let instance: EmbeddedComponentFactoryImpl = null;

describe("EmbeddedComponentFactoryImpl", () => {

	beforeEach(() => {
		instance = new EmbeddedComponentFactoryImpl(context(), componentId, TEST, null);
	});

	afterEach(() => {
		instance = null;
	});

	test("Instance is good and ready", () => {
		expect(instance).not.toBeNull();
	});

});
