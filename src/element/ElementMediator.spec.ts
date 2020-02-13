import ModelMediator from "@/model/ModelMediator";
import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import ElementMediator from "@/element/ElementMediator";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import Modules from "@/module/Modules";

class TestElementMediator extends ElementMediator<any, any, any> {

	constructor(dependencies: any) {
		super(dependencies, false);
	}

	public bridgeProxy(name: string): void {
		this.bridge(name);
	}

	public mediateProxy<T>(expression: string): ModelMediator<T> {
		return this.mediate(expression);
	}

	public $applyProxy(fn: Function, args: any[]): any {
		this.$apply(fn, args);
	}

	protected wire(): void {
		// Intentionally do nothing
	}

	protected unwire(): void {
		// Intentionally do nothing
	}

}

describe("ElementMediator tests", () => {

	const dependencies: ElementMediatorDependencies = {
		el: null,
		expression: null,
		model: null,
		mvvm: null,
		parent: null,
		prefix: "prefix"
	};

	it("Constructor - null dependencies", () => {
		assertNullGuarded("dependencies", () => new TestElementMediator(null));
	});

	it("get() - null id", () => {
		assertNullGuarded("id", () => new TestElementMediator(dependencies).get(null));
	});

	it("get() - invalid id", () => {
		assertNullGuarded("id must be valid", () => new TestElementMediator(dependencies).get("Invalid id!"), "ValidationError");
	});

	it("setModule() - null moduleInstance", () => {
		assertNullGuarded("moduleInstance", () => new TestElementMediator(dependencies).setModule(null));
	});


	it("message() - null channelName", () => {
		assertNullGuarded("channelName", () => new TestElementMediator(dependencies).message(null, "messageName", "payload"));
	});

	it("message() - null messageName", () => {
		assertNullGuarded("messageName", () => new TestElementMediator(dependencies).message("channelName", null, "payload"));
	});

	it("message() - null payload", () => {
		assertNoErrorThrown(() => new TestElementMediator(dependencies).message("channelName", "messageName", null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("channelName", () => new TestElementMediator(dependencies).broadcast(null, "messageName", "payload"));
	});

	it("broadcast() - null messageName", () => {
		assertNullGuarded("messageName", () => new TestElementMediator(dependencies).broadcast("channelName", null, "payload"));
	});

	it("broadcast() - null payload", () => {
		const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
		specimen.setModule(Modules.getDefaultModule());
		assertNoErrorThrown(() => specimen.broadcast("channelName", "messageName", null));
	});

	it("broadcastGlobally() - null channelName", () => {
		assertNullGuarded("channelName", () => new TestElementMediator(dependencies).broadcastGlobally(null, "messageName", "payload"));
	});

	it("broadcastGlobally() - null messageName", () => {
		assertNullGuarded("messageName", () => new TestElementMediator(dependencies).broadcastGlobally("channelName", null, "payload"));
	});

	it("broadcastGlobally() - null payload", () => {
		assertNoErrorThrown(() => new TestElementMediator(dependencies).broadcastGlobally("channelName", "messageName", null));
	});

	it("on() - null messageName", () => {
		assertNullGuarded("messageName", () => new TestElementMediator(dependencies).on(null));
	});

	it("on().forChannel() - null channelName", () => {
		assertNullGuarded("channelName", () => new TestElementMediator(dependencies).on("messageName").forChannel(null));
	});

	it("on().forChannel().invoke() - null target", () => {
		assertNullGuarded("target", () => new TestElementMediator(dependencies).on("messageName").forChannel("channelName").invoke(null));
	});

	it("on().invoke() - null target", () => {
		assertNullGuarded("target", () => new TestElementMediator(dependencies).on("messageName").invoke(null));
	});

	it("bridge() - null name", () => {
		assertNullGuarded("name", () => new TestElementMediator(dependencies).bridgeProxy(null));
	});

	it("mediate() - null expression", () => {
		assertNullGuarded("expression", () => new TestElementMediator(dependencies).mediateProxy(null));
	});

	it("$apply() - null fn", () => {
		assertNullGuarded("fn", () => new TestElementMediator(dependencies).$applyProxy(null, []));
	});

	it("$apply() - null args", () => {
		assertNullGuarded("args", () => new TestElementMediator(dependencies).$applyProxy(() => {
			// Intentionally do nothing
		}, null));
	});

});
