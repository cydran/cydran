import { assertNoErrorThrown, assertNullGuarded } from "test/TestUtils";
import { spy, verify } from "ts-mockito";
import Module from 'module/Module';
import ModulesContextImpl from 'module/ModulesContextImpl';
import Component from 'component/Component';
import ScopeImpl from 'scope/ScopeImpl';
import ComponentOptions from 'component/ComponentOptions';
import ComponentTransitions from 'component/ComponentTransitions';
import DomImpl from 'dom/DomImpl';
import InstanceServicesImpl from 'context/InstanceServicesImpl';

const module: Module = new ModulesContextImpl(new InstanceServicesImpl(new DomImpl())).getDefaultModule();

const EVENT_LOG: string[] = [];

class EventLogger {

	private log: string[];

	constructor() {
		this.log = [];
		// HooksImpl.INSTANCE.getDigestionCycleStartHooks().add((component) => this.getLog().push("Digested: " + component.getId()));
	}

	public reset(): void {
		this.log = [];
	}

	protected logEvent(text: string): void {
		this.log.push(text);
	}

	public getLog(): string[] {
		return this.log;
	}

}

const EVENT_LOGGER: EventLogger = new EventLogger();

class RegionAtRootComponent extends Component {

	constructor() {
		super("<script type='cydran/region'></script>");
	}

}

const ROOT_TEMPLATE: string = "<div></div>";

class TestComponent extends Component {

	private barCount: number;

	private bazCount: number;

	constructor() {
		super(ROOT_TEMPLATE);
		this.barCount = 0;
		this.bazCount = 0;
		this.$c().onMessage("bar").forChannel("foo").invoke(this.onBar);
		this.$c().onMessage("baz").forChannel("foo").invoke(this.onBaz);
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

}

class SimpleComponent extends Component {

	constructor(template: string, options?: ComponentOptions) {
		super(template, options);
	}

}

module.associate(RegionAtRootComponent, TestComponent, SimpleComponent);

test("Fails with an exception when script used at top level of template", () => {

	let thrown: Error = null;

	try {
		new RegionAtRootComponent().tell(ComponentTransitions.INIT);
	} catch (e) {
		thrown = e;
	}

	expect(thrown).not.toBeNull();
	expect(thrown.message).toEqual("Component template must not use a script tag as top-level element in component RegionAtRootComponent");
	expect(thrown.name).toEqual("TemplateError");
});

test("Correct listeners executed", () => {
	const component: TestComponent = new TestComponent();
	component.$c().send("bar", {}).onChannel("foo").toSelf();
	component.$c().send("bar", {}).onChannel("foo").toSelf();
	component.$c().send("baz", {}).onChannel("foo").toSelf();
	component.$c().send("baz", {}).onChannel("foo").toSelf();
	expect(component.getBarCount()).toEqual(2);
	expect(component.getBazCount()).toEqual(2);
});

test("Constructor() - null template", () => {
	assertNullGuarded("template", () => new SimpleComponent(null));
});

test("Constructor() - non-string template", () => {
	let thrown: Error = null;
	let specimen: Component = null;

	try {
		specimen = new SimpleComponent({} as string);
	} catch (e) {
		thrown = e;
	}

	expect(specimen).toBeNull();
	expect(thrown).not.toBeNull();
	expect("TemplateError").toEqual(thrown.name);
	expect("Template must be a string, HTMLElement or Renderer - object").toEqual(thrown.message);
});

test("setChild(\"<invalid_name>\") - catch error", () => {
	expect(() => new TestComponent().$c().setChild("bubba", new SimpleComponent(ROOT_TEMPLATE))).toThrow();
});

test("setChild() - null name", () => {
	assertNullGuarded("name", () => new TestComponent().$c().regions().set(null, new SimpleComponent(ROOT_TEMPLATE)));
});

test("setChildFromRegistry() - null name", () => {
	assertNullGuarded("name", () => new TestComponent().$c().regions().setFromRegistry(null, "componentName"));
});

test("setChildFromRegistry() - null componentId", () => {
	assertNullGuarded("componentId", () => new TestComponent().$c().regions().setFromRegistry("name", null));
});

test("setChildFromRegistry() - invalid componentId", () => {
	assertNullGuarded("componentId must be valid", () => new TestComponent().$c().regions().setFromRegistry("name", "Invalid id!"), "ValidationError");
});

test("metadata().get() - null name", () => {
	assertNullGuarded("name", () => new SimpleComponent(ROOT_TEMPLATE).$c().metadata().get(null));
});

test("metadata().has() - null name", () => {
	assertNullGuarded("name", () => new SimpleComponent(ROOT_TEMPLATE).$c().metadata().has(null));
});

test("getPrefix()", () => {
	const prefix = "custom-prefix";
	const instance = new SimpleComponent(ROOT_TEMPLATE, { prefix: prefix });

	expect(prefix).toEqual(instance.$c().getPrefix());
});

test("getScope()", () => {
	const prefix = "custom-prefix";
	const instance = new SimpleComponent(ROOT_TEMPLATE, { prefix: prefix });
	const result = instance.$c().scope();
	expect(result).toBeInstanceOf(ScopeImpl);
});

test("getParent() - null", () => {
	expect(new SimpleComponent(ROOT_TEMPLATE).$c().getParent()).toBeNull();
});

test("hasRegion() - null name", () => {
	assertNullGuarded("name", () => new SimpleComponent(ROOT_TEMPLATE).$c().regions().has(null));
});

test("get() - null id", () => {
	assertNullGuarded("id", () => new SimpleComponent(ROOT_TEMPLATE).$c().getObject(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new SimpleComponent(ROOT_TEMPLATE).$c().getObject("Invalid id!"), "ValidationError");
});

test("send() - null channelName", () => {
	assertNullGuarded("channelName", () => new SimpleComponent(ROOT_TEMPLATE).$c().send("messageName", "payload").onChannel(null).toSelf());
});

test("send() - null messageName", () => {
	assertNullGuarded("messageName", () => new SimpleComponent(ROOT_TEMPLATE).$c().send(null, "payload").onChannel("channelName").toSelf());
});

test("send() - null payload", () => {
	assertNoErrorThrown(() => new SimpleComponent(ROOT_TEMPLATE).$c().send("messageName", null).onChannel("channelName").toSelf());
});

test("send() - omitted payload", () => {
	assertNoErrorThrown(() => new SimpleComponent(ROOT_TEMPLATE).$c().send("messageName").onChannel("channelName").toSelf());
});

test("send() - null channelName", () => {
	assertNullGuarded("channelName", () => new TestComponent().$c().send("messageName", "payload").onChannel(null).toModule());
});

test("send() - null messageName", () => {
	assertNullGuarded("messageName", () => new TestComponent().$c().send(null, "payload").onChannel("channelName").toModule());
});

test("broadcast() - null payload", () => {
	assertNoErrorThrown(() => new TestComponent().$c().send("messageName", null).onChannel("channelName").toModule());
});

test("broadcast() - omitted payload", () => {
	assertNoErrorThrown(() => new TestComponent().$c().send("messageName").onChannel("channelName").toModule());
});

test("broadcastGlobally() - null channelName", () => {
	assertNullGuarded("channelName", () => new TestComponent().$c().send("messageName", "payload").onChannel(null).globally());
});

test("broadcastGlobally() - null messageName", () => {
	assertNullGuarded("messageName", () => new TestComponent().$c().send(null, "payload").onChannel("channelName").globally());
});

test("broadcastGlobally() - null payload", () => {
	assertNoErrorThrown(() => new TestComponent().$c().send("messageName", null).onChannel("channelName").globally());
});

test("broadcastGlobally() - omitted payload", () => {
	assertNoErrorThrown(() => new TestComponent().$c().send("messageName").onChannel("channelName").globally());
});

test("on() - null messageName", () => {
	assertNullGuarded("messageName", () => new TestComponent().$c().onMessage(null));
});

test("onMessage().forChannel() - null channelName", () => {
	assertNullGuarded("channelName", () => new TestComponent().$c().onMessage("messageName").forChannel(null));
});

test("on().forChannel().invoke() - null target", () => {
	assertNullGuarded("target", () => new TestComponent().$c().onMessage("messageName").forChannel("channelName").invoke(null));
});

test("on().invoke() - null target", () => {
	assertNullGuarded("target", () => new TestComponent().$c().onMessage("messageName").invoke(null));
});

test("watch() - null expression", () => {
	assertNullGuarded("expression", () => new TestComponent().$c().onExpressionChange(null, () => {
		// Intentionally do nothing
	}));
});

test("watch() - null target", () => {
	assertNullGuarded("target", () => new TestComponent().$c().onExpressionChange("expression", null));
});

test("Digest frequency", () => {
	EVENT_LOGGER.reset();
	const component: Component = new SimpleComponent("<div></div>");
	expect(EVENT_LOGGER.getLog().length).toEqual(0);
});
