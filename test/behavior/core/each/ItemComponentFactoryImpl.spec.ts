import ItemComponentFactoryImpl from "behavior/core/each/ItemComponentFactoryImpl";
import StageImpl from 'context/RootContextImpl';

const template: string = "<div></div>";
const prefix: string = "x";

function context(): StageImpl {
	const wkMod: StageImpl = new StageImpl("body");
	return wkMod;
}

let instance: ItemComponentFactoryImpl = null;
beforeEach(() => {
	const wkMod: StageImpl = context();
	instance = new ItemComponentFactoryImpl(wkMod, template, prefix, null, null);
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
	const wkSpy:ItemComponentFactoryImpl = jest.spyOn(instance, 'create');
	instance.create(wkItem);
	expect(wkSpy).toBeCalledTimes(1);
});
