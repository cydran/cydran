import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import ContextImpl from "context/ContextImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from "properties/Property";
import ContextsImpl from "context/ContextsImpl";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import DomWalker from "component/DomWalker";
import ServicesImpl from "service/ServicesImpl";
import Services from "service/Services";
import DomImpl from "dom/DomImpl";
import Dom from "dom/Dom";
import ScopeImpl from "scope/ScopeImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";

class TestComponent extends Component {

	constructor(template: string, options: ComponentOptions = {}) {
		super(template, options);
	}

}

const componentId: string = "testcomponent";
const TEST: string = "test";
const scope: ScopeImpl = new ScopeImpl();

function domInstance(): Dom {
	return new DomImpl();
}

function servicesInstance(): Services {
	return new ServicesImpl(domInstance());
}

function walkerInstance(): DomWalker {
	return new MvvmDomWalkerImpl(servicesInstance());
}

function contextsInstance(): ContextsImpl {
	return new ContextsImpl(servicesInstance());
}

function propertiesInstance(): MutableProperties {
	return new PropertiesImpl();
}

function context(): ContextImpl {
	const wkMod: ContextImpl = new ContextImpl(servicesInstance(), walkerInstance(), TEST, contextsInstance(), scope, propertiesInstance());
	wkMod.registerPrototype(componentId, TestComponent);
	return wkMod;
}

let instance: EmbeddedComponentFactoryImpl = null;
beforeEach(() => {
	instance = new EmbeddedComponentFactoryImpl(context(), componentId, TEST, null);
});

afterEach(() => {
	instance = null;
});

test("Instance is good and ready", () => {
	expect(instance).not.toBeNull();
});

test.skip("create", () => {
	// TODO: not sure how to approach this
	const wkItem: {} = {'id': 12311523, 'value': 'abc'};
	const wkSpy:EmbeddedComponentFactoryImpl = jest.spyOn(instance, 'create');
	instance.create(wkItem);
	expect(wkSpy).toBeCalledTimes(1);
});
