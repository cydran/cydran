import { Component } from "Component";
import { assertNullGuarded } from "TestUtils";
import { spy, verify } from "ts-mockito";
import { Scope } from "Interfaces";
import { StageImpl } from "Component";
import { Module } from "interface/Module";

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
	assertNullGuarded("callback", () => new StageImpl(HTML).withInitializer(null));
});

test("get() - null id", () => {
	assertNullGuarded("id", () => new StageImpl(HTML).get(null));
});

test("setComponentFromRegistry() - null componentName", () => {
	assertNullGuarded("componentName", () => new StageImpl(HTML).setComponentFromRegistry(null));
});

test.skip("setComponent()", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const testComponent: Component = new TestComponent();
	specimen.setComponent(testComponent);
});

test("getDefaultModule(): Module", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = spy(specimen);
	const result: Module = specimen.getDefaultModule();
	expect(result).not.toBeNull();
	verify(spySpecimen.getDefaultModule()).once();
});

test.skip("forEach(fn: (instace: Module) => void): void", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = spy(specimen);
});

test("getScope(): Scope", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = spy(specimen);
	const result: Scope = specimen.getScope();
	expect(result).not.toBeNull();
	verify(spySpecimen.getScope()).once();
});

test("registerConstant(id: string, instance: any): void", () => {
	const specimen = new StageImpl(HTML);
	const spySpecimen: StageImpl = spy(specimen);
	const testConstant: string = "constant";
	specimen.registerConstant("test1", testConstant);
	verify(spySpecimen.registerConstant("test1", testConstant)).once();
});

test("registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): void", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = spy(specimen);
	const testConstant: string = "constant";
	specimen.registerPrototype("test2", TestComponent);
	specimen.registerPrototype("test3", TestComponent);
	verify(spySpecimen.registerPrototype("test2", TestComponent)).once();
	verify(spySpecimen.registerPrototype("test3", TestComponent)).once();
});

test("registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): void", () => {
	const key: string = "test4";
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = spy(specimen);
	const testConstant: string = "constant";
	specimen.registerSingleton(key, TestComponent);
	verify(spySpecimen.registerSingleton(key, TestComponent)).once();
});

test("broadcast(channelName: string, messageName: string, payload?: any): void", () => {
	const specimen: StageImpl = new StageImpl(HTML);
	const spySpecimen: StageImpl = spy(specimen);
	const channel: string = "testChannel";
	const msgName: string = "Bananas";
	specimen.broadcast(channel, msgName);
	verify(spySpecimen.broadcast(channel, msgName));
});
