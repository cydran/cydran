/**
 * @jest-environment jsdom
 */
import { assertNoErrorThrown, assertNullGuarded } from "test/TestUtils";
import { spy, verify } from "ts-mockito";
import Module from 'module/Module';
import ModulesContextImpl from 'module/ModulesContextImpl';
import HooksImpl from 'digest/HooksImpl';
import Component from 'component/Component';
import OnContinuation from 'message/OnContinuation';
import ScopeImpl from 'scope/ScopeImpl';
import ComponentOptions from 'component/ComponentOptions';
import ComponentTransitions from 'component/ComponentTransitions';
import DomImpl from 'dom/DomImpl';

const module: Module = new ModulesContextImpl(new DomImpl()).getDefaultModule();

const EVENT_LOG: string[] = [];

class EventLogger {

	private log: string[];

	constructor() {
		this.log = [];
		HooksImpl.INSTANCE.getDigestionCycleStartHooks().add((component) => this.getLog().push("Digested: " + component.getId()));
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

	public broadcastProxy(channelName: string, messageName: string, payload?: any): void {
		return this.broadcast(channelName, messageName, payload);
	}

	public broadcastGloballyProxy(channelName: string, messageName: string, payload?: any): void {
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
	component.message("foo", "bar", {});
	component.message("foo", "bar", {});
	component.message("foo", "baz", {});
	component.message("foo", "baz", {});

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
	expect(() => new TestComponent().setChild("bubba", new SimpleComponent(ROOT_TEMPLATE))).toThrow();
});

test("setChild() - null name", () => {
	assertNullGuarded("name", () => new TestComponent().setChild(null, new SimpleComponent(ROOT_TEMPLATE)));
});

test("setChildFromRegistry() - null name", () => {
	assertNullGuarded("name", () => new TestComponent().setChildFromRegistry(null, "componentName"));
});

test("setChildFromRegistry() - null componentId", () => {
	assertNullGuarded("componentId", () => new TestComponent().setChildFromRegistry("name", null));
});

test("setChildFromRegistry() - invalid componentId", () => {
	assertNullGuarded("componentId must be valid", () => new TestComponent().setChildFromRegistry("name", "Invalid id!"), "ValidationError");
});

test("metadata().get() - null name", () => {
	assertNullGuarded("name", () => new SimpleComponent(ROOT_TEMPLATE).metadata().get(null));
});

test("metadata().has() - null name", () => {
	assertNullGuarded("name", () => new SimpleComponent(ROOT_TEMPLATE).metadata().has(null));
});

test("getPrefix()", () => {
	const prefix = "custom-prefix";
	const instance = new SimpleComponent(ROOT_TEMPLATE, { prefix: prefix });

	expect(prefix).toEqual(instance.getPrefix());
});

test("getScope()", () => {
	const prefix = "custom-prefix";
	const instance = new SimpleComponent(ROOT_TEMPLATE, { prefix: prefix });
	const result = instance.scope();
	expect(result).toBeInstanceOf(ScopeImpl);
});

test("getParent() - null", () => {
	expect(new SimpleComponent(ROOT_TEMPLATE).getParent()).toBeNull();
});

test("hasRegion() - null name", () => {
	assertNullGuarded("name", () => new SimpleComponent(ROOT_TEMPLATE).hasRegion(null));
});

test("get() - null id", () => {
	assertNullGuarded("id", () => new SimpleComponent(ROOT_TEMPLATE).get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new SimpleComponent(ROOT_TEMPLATE).get("Invalid id!"), "ValidationError");
});

test("message() - null channelName", () => {
	assertNullGuarded("channelName", () => new SimpleComponent(ROOT_TEMPLATE).message(null, "messageName", "payload"));
});

test("message() - null messageName", () => {
	assertNullGuarded("messageName", () => new SimpleComponent(ROOT_TEMPLATE).message("channelName", null, "payload"));
});

test("message() - null payload", () => {
	assertNoErrorThrown(() => new SimpleComponent(ROOT_TEMPLATE).message("channelName", "messageName", null));
});

test("message() - omitted payload", () => {
	assertNoErrorThrown(() => new SimpleComponent(ROOT_TEMPLATE).message("channelName", "messageName"));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded("channelName", () => new TestComponent().broadcastProxy(null, "messageName", "payload"));
});

test("broadcast() - null messageName", () => {
	assertNullGuarded("messageName", () => new TestComponent().broadcastProxy("channelName", null, "payload"));
});

test("broadcast() - null payload", () => {
	assertNoErrorThrown(() => new TestComponent().broadcastProxy("channelName", "messageName", null));
});

test("broadcast() - omitted payload", () => {
	assertNoErrorThrown(() => new TestComponent().broadcastProxy("channelName", "messageName"));
});

test("broadcastGlobally() - null channelName", () => {
	assertNullGuarded("channelName", () => new TestComponent().broadcastGloballyProxy(null, "messageName", "payload"));
});

test("broadcastGlobally() - null messageName", () => {
	assertNullGuarded("messageName", () => new TestComponent().broadcastGloballyProxy("channelName", null, "payload"));
});

test("broadcastGlobally() - null payload", () => {
	assertNoErrorThrown(() => new TestComponent().broadcastGloballyProxy("channelName", "messageName", null));
});

test("broadcastGlobally() - omitted payload", () => {
	assertNoErrorThrown(() => new TestComponent().broadcastGloballyProxy("channelName", "messageName"));
});

test("on() - null messageName", () => {
	assertNullGuarded("messageName", () => new TestComponent().onProxy(null));
});

test("on().forChannel() - null channelName", () => {
	assertNullGuarded("channelName", () => new TestComponent().onProxy("messageName").forChannel(null));
});

test("on().forChannel().invoke() - null target", () => {
	assertNullGuarded("target", () => new TestComponent().onProxy("messageName").forChannel("channelName").invoke(null));
});

test("on().invoke() - null target", () => {
	assertNullGuarded("target", () => new TestComponent().onProxy("messageName").invoke(null));
});

test("watch() - null expression", () => {
	assertNullGuarded("expression", () => new TestComponent().watchProxy(null, () => {
		// Intentionally do nothing
	}));
});

test("watch() - null target", () => {
	assertNullGuarded("target", () => new TestComponent().watchProxy("expression", null));
});

test("Digest frequency", () => {
	EVENT_LOGGER.reset();
	const component: Component = new SimpleComponent("<div></div>");
	expect(EVENT_LOGGER.getLog().length).toEqual(0);
});
