import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import RootContextImpl from 'context/RootContextImpl';

class TestComponent extends Component {

	constructor(template: string, options: ComponentOptions = {}) {
		super(template, options);
	}

}

const componentId: string = "testcomponent";
const TEST: string = "test";

function context(): RootContextImpl {
	const wkMod: RootContextImpl = new RootContextImpl();
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
