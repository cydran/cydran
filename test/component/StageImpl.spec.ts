import { assertNullGuarded } from "test/TestUtils";
import Component from 'component/Component';
import { StageImpl } from 'context/RootContextImpl';
import Scope from 'scope/Scope';

const HTML: string = "html";
const ROOT_TEMPLATE: string = "<div></div>";

class TestComponent extends Component {

	private count: number = 0;

	constructor() {
		super(ROOT_TEMPLATE);
	}

	public incrementCount(span?: number) {
		this.count += span | 1;
	}

	public getCount(): number {
		return this.count;
	}
}

test("Constructor null argument", () => {
	assertNullGuarded("rootSelector", () => new StageImpl(null));
});

test("Constructor null initializer", () => {
	assertNullGuarded("callback", () => new StageImpl(HTML).addInitializer(null));
});

test("getObject() - null id", () => {
	assertNullGuarded("id", () => new StageImpl(HTML).getObject(null));
});

test("setComponentFromRegistry() - null componentName", () => {
	assertNullGuarded("componentName", () => new StageImpl(HTML).setComponentFromRegistry(null));
});

test("getScope(): Scope", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = jest.spyOn(specimen, 'getScope');
	const result: Scope = specimen.getScope();
	expect(result).not.toBeNull();
	expect(spySpecimen).toHaveBeenCalledTimes(1);
});

test("registerConstant(id: string, instance: any): void", () => {
	const specimen = new StageImpl(HTML);
	const spySpecimen: StageImpl = jest.spyOn(specimen, 'registerConstant');
	const testConstant: string = "constant";
	const tVal: string = "test1";
	specimen.registerConstant(tVal, testConstant);
	expect(spySpecimen).toHaveBeenCalledTimes(1);
	expect(spySpecimen).toHaveBeenCalledWith(tVal, testConstant);
});

test("registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): void", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = jest.spyOn(specimen, 'registerPrototype');
	const tc2: string = "test2";
	const tc3: string = "test3";
	specimen.registerPrototype(tc2, TestComponent);
	specimen.registerPrototype(tc3, TestComponent);
	expect(spySpecimen).toHaveBeenCalledTimes(2);
	expect(spySpecimen).toHaveBeenNthCalledWith(1, tc2, TestComponent);
	expect(spySpecimen).toHaveBeenNthCalledWith(2, tc3, TestComponent);
});

test("registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): void", () => {
	const key: string = "test4";
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = jest.spyOn(specimen, 'registerSingleton');
	specimen.registerSingleton(key, TestComponent);
	expect(spySpecimen).toHaveBeenCalledTimes(1);
	expect(spySpecimen).toHaveBeenCalledWith(key, TestComponent);
});

test("message(channelName: string, messageName: string, payload?: any): void", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = jest.spyOn(specimen, 'message');
	const channel: string = "testChannel";
	const msgName: string = "Bananas";
	specimen.message(channel, msgName);
	expect(spySpecimen).toHaveBeenCalledTimes(1);
	expect(spySpecimen).toHaveBeenCalledWith(channel, msgName);
});
