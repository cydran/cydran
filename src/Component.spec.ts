import { Component, Events, OnContinuation, Properties } from "@/Core";
import { assertNoErrorThrown, assertNullGuarded } from "@/TestUtils";
import { assert } from "chai";
import { JSDOM } from "jsdom";
import { describe, it } from "mocha";

Properties.setWindow(new JSDOM("<html></html>").window);

class TestComponent extends Component {

	private barCount: number;

	private bazCount: number;

	constructor() {
		super("<div></div>");
		this.barCount = 0;
		this.bazCount = 0;
		this.on("bar").forChannel("foo").invoke(this.onBar);
		this.on("baz").forChannel("foo").invoke(this.onBaz);
	}

	public onBar(): void {
		this.barCount++;
	}

	public onBaz(): void {
		this.bazCount++;
	}

	public getBarCount(): number {
		return this.barCount;
	}

	public getBazCount(): number {
		return this.bazCount;
	}

	public broadcastProxy(channelName: string, messageName: string, payload: any): void {
		return this.broadcast(channelName, messageName, payload);
	}

	public broadcastGloballyProxy(channelName: string, messageName: string, payload: any): void {
		return this.broadcastGlobally(channelName, messageName, payload);
	}

	public onProxy(messageName: string): OnContinuation {
		return this.on(messageName);
	}

	public watchProxy(expression: string, target: (previous: any, current: any) => void): void {
		this.watch(expression, target);
	}

	public $applyProxy(fn: Function, args: any[]): void {
		this.$apply(fn, args);
	}

}

class ParentTestComponent extends Component {

	constructor() {
		super('<div><c:region name="test"></c:region></div>');
	}

}

class ChildTestComponent extends Component {

	private afterParentAddedCount: number;

	private afterParentChangedCount: number;

	private afterParentRemovedCount: number;

	private beforeParentAddedCount: number;

	private beforeParentChangedCount: number;

	private beforeParentRemovedCount: number;

	constructor() {
		super("<div></div>");
		this.on(Events.AFTER_PARENT_ADDED).invoke(this.onAfterParentAdded);
		this.on(Events.AFTER_PARENT_CHANGED).invoke(this.onAfterParentChanged);
		this.on(Events.AFTER_PARENT_REMOVED).invoke(this.onAfterParentRemoved);
		this.on(Events.BEFORE_PARENT_ADDED).invoke(this.onBeforeParentAdded);
		this.on(Events.BEFORE_PARENT_CHANGED).invoke(this.onBeforeParentChanged);
		this.on(Events.BEFORE_PARENT_REMOVED).invoke(this.onBeforeParentRemoved);
	}

	public onAfterParentAdded(): void {
		this.afterParentAddedCount++;
	}

	public onAfterParentChanged(): void {
		this.afterParentChangedCount++;
	}

	public onAfterParentRemoved(): void {
		this.afterParentRemovedCount++;
	}

	public onBeforeParentAdded(): void {
		this.beforeParentAddedCount++;
	}

	public onBeforeParentChanged(): void {
		this.beforeParentChangedCount++;
	}

	public onBeforeParentRemoved(): void {
		this.beforeParentRemovedCount++;
	}

	public init(): void {
		this.afterParentAddedCount = 0;
		this.afterParentChangedCount = 0;
		this.afterParentRemovedCount = 0;
		this.beforeParentAddedCount = 0;
		this.beforeParentChangedCount = 0;
		this.beforeParentRemovedCount = 0;
	}

	public getAfterParentAddedCount(): number {
		return this.afterParentAddedCount;
	}

	public getAfterParentChangedCount(): number {
		return this.afterParentChangedCount;
	}

	public getAfterParentRemovedCount(): number {
		return this.afterParentRemovedCount;
	}

	public getBeforeParentAddedCount(): number {
		return this.beforeParentAddedCount;
	}

	public getBeforeParentChangedCount(): number {
		return this.beforeParentChangedCount;
	}

	public getBeforeParentRemovedCount(): number {
		return this.beforeParentRemovedCount;
	}

}

describe("Component tests", () => {

	it("Correct listeners executed", () => {
		const component: TestComponent = new TestComponent();
		component.message("foo", "bar", {});
		component.message("foo", "bar", {});
		component.message("foo", "baz", {});
		component.message("foo", "baz", {});

		assert.equal(component.getBarCount(), 2);
		assert.equal(component.getBazCount(), 2);
	});

	it("Correct parent and child listeners executed", () => {
		const parent0: ParentTestComponent = new ParentTestComponent();
		const parent1: ParentTestComponent = new ParentTestComponent();
		const child0: ChildTestComponent = new ChildTestComponent();
		const child1: ChildTestComponent = new ChildTestComponent();

		parent0.setChild("test", child0);
		assert.equal(child0.getAfterParentAddedCount(), 1, "parent0.setChild(child0) - child0.getAfterParentAddedCount");
		assert.equal(child0.getAfterParentChangedCount(), 1, "parent0.setChild(child0) - child0.getAfterParentChangedCount");
		assert.equal(child0.getAfterParentRemovedCount(), 0, "parent0.setChild(child0) - child0.getAfterParentRemovedCount");
		assert.equal(child0.getBeforeParentAddedCount(), 1, "parent0.setChild(child0) - child0.getBeforeParentAddedCount");
		assert.equal(child0.getBeforeParentChangedCount(), 1, "parent0.setChild(child0) - child0.getBeforeParentChangedCount");
		assert.equal(child0.getBeforeParentRemovedCount(), 0, "parent0.setChild(child0) - child0.getBeforeParentRemovedCount");
		assert.equal(child1.getAfterParentAddedCount(), 0, "parent0.setChild(child0) - child1.getAfterParentAddedCount");
		assert.equal(child1.getAfterParentChangedCount(), 0, "parent0.setChild(child0) - child1.getAfterParentChangedCount");
		assert.equal(child1.getAfterParentRemovedCount(), 0, "parent0.setChild(child0) - child1.getAfterParentRemovedCount");
		assert.equal(child1.getBeforeParentAddedCount(), 0, "parent0.setChild(child0) - child1.getBeforeParentAddedCount");
		assert.equal(child1.getBeforeParentChangedCount(), 0, "parent0.setChild(child0) - child1.getBeforeParentChangedCount");
		assert.equal(child1.getBeforeParentRemovedCount(), 0, "parent0.setChild(child0) - child1.getBeforeParentRemovedCount");
		child0.reset();
		child1.reset();

		parent0.setChild("test", child1);
		assert.equal(child0.getAfterParentAddedCount(), 0, "parent0.setChild(child1) - child0.getAfterParentAddedCount");
		assert.equal(child0.getAfterParentChangedCount(), 1, "parent0.setChild(child1) - child0.getAfterParentChangedCount");
		assert.equal(child0.getAfterParentRemovedCount(), 1, "parent0.setChild(child1) - child0.getAfterParentRemovedCount");
		assert.equal(child0.getBeforeParentAddedCount(), 0, "parent0.setChild(child1) - child0.getBeforeParentAddedCount");
		assert.equal(child0.getBeforeParentChangedCount(), 1, "parent0.setChild(child1) - child0.getBeforeParentChangedCount");
		assert.equal(child0.getBeforeParentRemovedCount(), 1, "parent0.setChild(child1) - child0.getBeforeParentRemovedCount");
		assert.equal(child1.getAfterParentAddedCount(), 1, "parent0.setChild(child1) - child1.getAfterParentAddedCount");
		assert.equal(child1.getAfterParentChangedCount(), 1, "parent0.setChild(child1) - child1.getAfterParentChangedCount");
		assert.equal(child1.getAfterParentRemovedCount(), 0, "parent0.setChild(child1) - child1.getAfterParentRemovedCount");
		assert.equal(child1.getBeforeParentAddedCount(), 1, "parent0.setChild(child1) - child1.getBeforeParentAddedCount");
		assert.equal(child1.getBeforeParentChangedCount(), 1, "parent0.setChild(child1) - child1.getBeforeParentChangedCount");
		assert.equal(child1.getBeforeParentRemovedCount(), 0, "parent0.setChild(child1) - child1.getBeforeParentRemovedCount");
		child0.reset();
		child1.reset();

		parent1.setChild("test", child1);
		assert.equal(child0.getAfterParentAddedCount(), 0, "parent1.setChild(child1) - child0.getAfterParentAddedCount");
		assert.equal(child0.getAfterParentChangedCount(), 0, "parent1.setChild(child1) - child0.getAfterParentChangedCount");
		assert.equal(child0.getAfterParentRemovedCount(), 0, "parent1.setChild(child1) - child0.getAfterParentRemovedCount");
		assert.equal(child0.getBeforeParentAddedCount(), 0, "parent1.setChild(child1) - child0.getBeforeParentAddedCount");
		assert.equal(child0.getBeforeParentChangedCount(), 0, "parent1.setChild(child1) - child0.getBeforeParentChangedCount");
		assert.equal(child0.getBeforeParentRemovedCount(), 0, "parent1.setChild(child1) - child0.getBeforeParentRemovedCount");
		assert.equal(child1.getAfterParentAddedCount(), 0, "parent1.setChild(child1) - child1.getAfterParentAddedCount");
		assert.equal(child1.getAfterParentChangedCount(), 1, "parent1.setChild(child1) - child1.getAfterParentChangedCount");
		assert.equal(child1.getAfterParentRemovedCount(), 0, "parent1.setChild(child1) - child1.getAfterParentRemovedCount");
		assert.equal(child1.getBeforeParentAddedCount(), 0, "parent1.setChild(child1) - child1.getBeforeParentAddedCount");
		assert.equal(child1.getBeforeParentChangedCount(), 1, "parent1.setChild(child1) - child1.getBeforeParentChangedCount");
		assert.equal(child1.getBeforeParentRemovedCount(), 0, "parent1.setChild(child1) - child1.getBeforeParentRemovedCount");
		child0.reset();
		child1.reset();
	});

	it("Constructor() - null template", () => {
		assertNullGuarded("template", () => new Component(null));
	});

	it("Constructor() - non-string template", () => {
		let thrown: Error = null;
		let specimen: Component = null;

		try {
			specimen = new Component({} as string);
		} catch (e) {
			thrown = e;
		}

		assert.isNull(specimen);
		assert.isNotNull(thrown);
		assert.equal("TemplateError", thrown.name);
		assert.equal("Template must be a string", thrown.message);
	});

	it("setChild() - null name", () => {
		assertNullGuarded("name", () => new TestComponent().setChild(null, new Component("<div></div>")));
	});

	it("setChildFromRegistry() - null name", () => {
		assertNullGuarded("name", () => new TestComponent().setChildFromRegistry(null, "componentName"));
	});

	it("setChildFromRegistry() - null componentName", () => {
		assertNullGuarded("componentName", () => new TestComponent().setChildFromRegistry("name", null));
	});

	it("metadata().get() - null name", () => {
		assertNullGuarded("name", () => new Component("<div></div>").metadata().get(null));
	});

	it("metadata().has() - null name", () => {
		assertNullGuarded("name", () => new Component("<div></div>").metadata().has(null));
	});

	it("hasRegion() - null name", () => {
		assertNullGuarded("name", () => new Component("<div></div>").hasRegion(null));
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new Component("<div></div>").get(null));
	});

	it("message() - null channelName", () => {
		assertNullGuarded("channelName", () => new Component("<div></div>").message(null, "messageName", "payload"));
	});

	it("message() - null messageName", () => {
		assertNullGuarded("messageName", () => new Component("<div></div>").message("channelName", null, "payload"));
	});

	it("message() - null payload", () => {
		assertNoErrorThrown(() => new Component("<div></div>").message("channelName", "messageName", null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("channelName", () => new TestComponent().broadcastProxy(null, "messageName", "payload"));
	});

	it("broadcast() - null messageName", () => {
		assertNullGuarded("messageName", () => new TestComponent().broadcastProxy("channelName", null, "payload"));
	});

	it("broadcast() - null payload", () => {
		assertNoErrorThrown(() => new TestComponent().broadcastProxy("channelName", "messageName", null));
	});

	it("broadcastGlobally() - null channelName", () => {
		assertNullGuarded("channelName", () => new TestComponent().broadcastGloballyProxy(null, "messageName", "payload"));
	});

	it("broadcastGlobally() - null messageName", () => {
		assertNullGuarded("messageName", () => new TestComponent().broadcastGloballyProxy("channelName", null, "payload"));
	});

	it("broadcastGlobally() - null payload", () => {
		assertNoErrorThrown(() => new TestComponent().broadcastGloballyProxy("channelName", "messageName", null));
	});

	it("on() - null messageName", () => {
		assertNullGuarded("messageName", () => new TestComponent().onProxy(null));
	});

	it("on().forChannel() - null channelName", () => {
		assertNullGuarded("channelName", () => new TestComponent().onProxy("messageName").forChannel(null));
	});

	it("on().forChannel().invoke() - null target", () => {
		assertNullGuarded("target", () => new TestComponent().onProxy("messageName").forChannel("channelName").invoke(null));
	});

	it("on().invoke() - null target", () => {
		assertNullGuarded("target", () => new TestComponent().onProxy("messageName").invoke(null));
	});

	it("watch() - null expression", () => {
		assertNullGuarded("expression", () => new TestComponent().watchProxy(null, () => {
			// Intentionally do nothing
		}));
	});

	it("watch() - null target", () => {
		assertNullGuarded("target", () => new TestComponent().watchProxy("expression", null));
	});

	it("$apply() - null fn", () => {
		assertNullGuarded("fn", () => new TestComponent().$applyProxy(null, []));
	});

	it("$apply() - null args", () => {
		assertNullGuarded("args", () => new TestComponent().$applyProxy(() => {
			// Intentionally do nothing
		}, null));
	});

});
