import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import ModuleImpl from "module/ModuleImpl";
import PropertiesImpl from "properties/PropertiesImpl";
import { MutableProperties } from "properties/Property";
import ModulesContextImpl from "module/ModulesContextImpl";
import MvvmDomWalkerImpl from "component/MvvmDomWalkerImpl";
import DomWalker from "component/DomWalker";
import CydranContextImpl from "context/CydranContextImpl";
import CydranContext from "context/CydranContext";
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

function dom(): Dom {
	return new DomImpl();
}

function cydranContext(): CydranContext {
	return new CydranContextImpl(dom());
}

function walker(): DomWalker {
	return new MvvmDomWalkerImpl(cydranContext());
}

function modulesContext(): ModulesContextImpl {
	return new ModulesContextImpl(cydranContext());
}

function properties(): MutableProperties {
	return new PropertiesImpl();
}

function module(): ModuleImpl {
	const wkMod: ModuleImpl = new ModuleImpl(cydranContext(), walker(), TEST, modulesContext(), scope, properties());
	wkMod.registerPrototype(componentId, TestComponent);
	return wkMod;
}

let instance: EmbeddedComponentFactoryImpl = null;
beforeEach(() => {
	instance = new EmbeddedComponentFactoryImpl(module(), componentId, TEST, null);
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
