import Component from "@/component/Component";
import Scope from "@/model/Scope";
import Module from "@/module/Module";
import { StageImpl } from "@/stage/Stage";
import { assertNullGuarded } from "@/util/TestUtils";
import { JSDOM } from "jsdom";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { spy, verify } from "ts-mockito";
import Properties from "@/config/Properties";

Properties.setWindow(new JSDOM("<html></html>").window);

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

describe("Stage tests", () => {

	it("Constructor null argument", () => {
		assertNullGuarded("rootSelector", () => new StageImpl(null));
	});

	it("Constructor null initializer", () => {
		assertNullGuarded("callback", () => new StageImpl(HTML).withInitializer(null));
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new StageImpl(HTML).get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new StageImpl(HTML).get("Invalid id!"), "ValidationError");
	});

	it("setComponentFromRegistry() - null componentName", () => {
		assertNullGuarded("componentName", () => new StageImpl(HTML).setComponentFromRegistry(null));
	});

	xit("setComponent()", () => {
		const specimen: StageImpl = new StageImpl(HTML);
		const testComponent: Component = new TestComponent();
		specimen.setComponent(testComponent);
	});

	it("getDefaultModule(): Module", () => {
		const specimen: StageImpl = new StageImpl(HTML);
		const spySpecimen: StageImpl = spy(specimen);
		const result: Module = specimen.getDefaultModule();
		assert.isNotNull(result, "is null");
		verify(spySpecimen.getDefaultModule()).once();
	});

	xit("forEach(fn: (instace: Module) => void): void", () => {
		const specimen: StageImpl = new StageImpl(HTML);
		const spySpecimen: StageImpl = spy(specimen);
	});

	it("getScope(): Scope", () => {
		const specimen: StageImpl = new StageImpl(HTML);
		const spySpecimen: StageImpl = spy(specimen);
		const result: Scope = specimen.getScope();
		assert.isNotNull(result, "is null");
		verify(spySpecimen.getScope()).once();
	});

	it("registerConstant(id: string, instance: any): void", () => {
		const specimen = new StageImpl(HTML);
		const spySpecimen: StageImpl = spy(specimen);
		const testConstant: string = "constant";
		specimen.registerConstant("test1", testConstant);
		verify(spySpecimen.registerConstant("test1", testConstant)).once();
	});

	it("registerPrototype(id: string, classInstance: any, dependencies?: string[]): void", () => {
		const specimen: StageImpl = new StageImpl(HTML);
		const spySpecimen: StageImpl = spy(specimen);
		const testConstant: string = "constant";
		specimen.registerPrototype("test2", TestComponent);
		specimen.registerPrototype("test3", TestComponent);
		verify(spySpecimen.registerPrototype("test2", TestComponent)).once();
		verify(spySpecimen.registerPrototype("test3", TestComponent)).once();
	});

	it("registerSingleton(id: string, classInstance: any, dependencies?: string[]): void", () => {
		const key: string = "test4";
		const specimen: StageImpl = new StageImpl(HTML);
		const spySpecimen: StageImpl = spy(specimen);
		const testConstant: string = "constant";
		specimen.registerSingleton(key, TestComponent);
		verify(spySpecimen.registerSingleton(key, TestComponent)).once();
	});

	it("broadcast(channelName: string, messageName: string, payload?: any): void", () => {
		const specimen: StageImpl = new StageImpl(HTML);
		const spySpecimen: StageImpl = spy(specimen);
		const channel: string = "testChannel";
		const msgName: string = "Bananas";
		specimen.broadcast(channel, msgName);
		verify(spySpecimen.broadcast(channel, msgName));
	});

});
