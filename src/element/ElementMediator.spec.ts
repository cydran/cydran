import ModelMediator from "@/model/ModelMediator";
import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import DigestionCandidate from "@/mvvm/DigestionCandidate";
import DigestionCandidateConsumer from "@/mvvm/DigestionCandidateConsumer";
import ElementMediator from "@/element/ElementMediator";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import { Modules } from "@/module/Modules";

class TestDigestionCandidateConsumer implements DigestionCandidateConsumer {
	public add(key: string, mediators: DigestionCandidate[]): void {
		// do nothing
	}
}

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
		// console.log(this.getId(), "wired");
	}

	protected unwire(): void {
		// console.log(this.getId(), "un-wired");
	}

}

const CHANNEL_NAME: string = "channelName";
const MESSAGE_NAME: string = "messageName";
const PAYLOAD: string = "payload";

describe("ElementMediator tests", () => {

	const dependencies: ElementMediatorDependencies = {
		el: null,
		expression: "true",
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
		assertNullGuarded(CHANNEL_NAME, () => new TestElementMediator(dependencies).message(null, MESSAGE_NAME, PAYLOAD));
	});

	it("message() - null messageName", () => {
		assertNullGuarded(MESSAGE_NAME, () => new TestElementMediator(dependencies).message(CHANNEL_NAME, null, PAYLOAD));
	});

	it("message() - null payload", () => {
		assertNoErrorThrown(() => new TestElementMediator(dependencies).message(CHANNEL_NAME, MESSAGE_NAME, null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded(CHANNEL_NAME, () => new TestElementMediator(dependencies).broadcast(null, MESSAGE_NAME, PAYLOAD));
	});

	it("broadcast() - null messageName", () => {
		assertNullGuarded(MESSAGE_NAME, () => new TestElementMediator(dependencies).broadcast(CHANNEL_NAME, null, PAYLOAD));
	});

	it("broadcast() - null payload", () => {
		const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
		specimen.setModule(Modules.getDefaultModule());
		assertNoErrorThrown(() => specimen.broadcast(CHANNEL_NAME, MESSAGE_NAME, null));
	});

	it("broadcastGlobally() - null channelName", () => {
		assertNullGuarded(CHANNEL_NAME, () => new TestElementMediator(dependencies).broadcastGlobally(null, MESSAGE_NAME, PAYLOAD));
	});

	it("broadcastGlobally() - null messageName", () => {
		assertNullGuarded(MESSAGE_NAME, () => new TestElementMediator(dependencies).broadcastGlobally(CHANNEL_NAME, null, PAYLOAD));
	});

	it("broadcastGlobally() - null payload", () => {
		assertNoErrorThrown(() => new TestElementMediator(dependencies).broadcastGlobally(CHANNEL_NAME, MESSAGE_NAME, null));
	});

	it("dispose()", () => {
		const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
		const spySpecimen: ElementMediator<any, any, any> = spy(specimen);
		specimen.dispose();
		verify(spySpecimen.dispose()).once();
	});

	it("requestMediators()", () => {
		const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
		const spySpecimen: ElementMediator<any, any, any> = spy(specimen);
		const digCandCons: DigestionCandidateConsumer = new TestDigestionCandidateConsumer();
		specimen.requestMediators(digCandCons);
		verify(spySpecimen.requestMediators(digCandCons)).once();
	});

	it("getParentId() - null parent", () => {
		const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
		assert.throws(() => specimen.getParentId(), Error);
	});

	it("getId()", () => {
		const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
		assert.isNotNull(specimen.getId());
		assert.isString(specimen.getId());
	});

	it("hasPropagation() - should return false", () => {
		const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
		assert.isFalse(specimen.hasPropagation());
	});

	it("on() - null messageName", () => {
		assertNullGuarded(MESSAGE_NAME, () => new TestElementMediator(dependencies).on(null));
	});

	it("on().forChannel() - null channelName", () => {
		assertNullGuarded(CHANNEL_NAME, () => new TestElementMediator(dependencies).on(MESSAGE_NAME).forChannel(null));
	});

	it("on().forChannel().invoke() - null target", () => {
		assertNullGuarded("target", () => new TestElementMediator(dependencies).on(MESSAGE_NAME).forChannel(CHANNEL_NAME).invoke(null));
	});

	it("on().invoke() - null target", () => {
		assertNullGuarded("target", () => new TestElementMediator(dependencies).on(MESSAGE_NAME).invoke(null));
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
