import EmbeddedComponentFactoryImpl from "behavior/core/each/EmbeddedComponentFactoryImpl";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import Context from 'context/Context';
import GlobalContextImpl from 'context/GlobalContextImpl';

class TestComponent extends Component {

	constructor(template: string, options: ComponentOptions = {}) {
		super(template, options);
	}

}

const componentId: string = "testcomponent";
const TEST: string = "test";

function context(): Context {
	const wkContext: Context = new GlobalContextImpl().createChild();
	wkContext.getRegistry().registerPrototype(componentId, TestComponent);
	return wkContext;
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
