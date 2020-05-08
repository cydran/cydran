import PubSub from "@/message/PubSub";
import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import Component from "@/component/Component";
import PubSubImpl from "@/message/PubSubImpl";
import Module from "@/module/Module";
import ModulesImpl from "@/module/ModulesImpl";

class TestComponent extends Component {

	private wkvalue: string;

	constructor() {
		super("<div>{{m().wkvalue}}</div>");
	}

	protected init() {
		this.wkvalue = "Test Value";
	}

}

const module: Module = new ModulesImpl().getDefaultModule();

describe("PubSub tests", () => {

	it("Constructor - null context", () => {
		assertNullGuarded("context", () => new PubSubImpl(null, null));
	});

	it("message() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSubImpl({}, module).message(null, "messageName", "payload"));
	});

	it("message() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSubImpl({}, module).message("channelName", null, "payload"));
	});

	it("message() - null payload", () => {
		assertNoErrorThrown(() => new PubSubImpl({}, module).message("channelName", "messageName", null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSubImpl({}, module).broadcast(null, "messageName", "payload"));
	});

	it("broadcast() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSubImpl({}, module).broadcast("channelName", null, "payload"));
	});

	it("broadcast() - null payload", () => {
		assertNoErrorThrown(() => new PubSubImpl({}, module).broadcast("channelName", "messageName", null));
	});

	it("broadcastGlobally() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSubImpl({}, module).broadcastGlobally(null, "messageName", "payload"));
	});

	it("broadcastGlobally() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSubImpl({}, module).broadcastGlobally("channelName", null, "payload"));
	});

	it("broadcastGlobally() - null payload", () => {
		assertNoErrorThrown(() => new PubSubImpl({}, module).broadcastGlobally("channelName", "messageName", null));
	});

	it("on() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSubImpl({}, module).on(null));
	});

	it("on().forChannel() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSubImpl({}, module).on("messageName").forChannel(null));
	});

	it("on().forChannel().invoke() - null target", () => {
		assertNullGuarded("target", () => new PubSubImpl({}, module).on("messageName").forChannel("channelName").invoke(null));
	});

	it("on().invoke() - null target", () => {
		assertNullGuarded("target", () => new PubSubImpl({}, module).on("messageName").invoke(null));
	});

	it("enableGlobal()", () => {
		const specimen: PubSub = new PubSubImpl({}, module);
		const spySub: PubSub = spy(specimen);
		specimen.enableGlobal();
		verify(spySub.enableGlobal()).once();
	});

	it("disableGlobal()", () => {
		const specimen: PubSub = new PubSubImpl({}, module);
		const spySub: PubSub = spy(specimen);
		specimen.enableGlobal();
		verify(spySub.enableGlobal()).once();
		specimen.disableGlobal();
		verify(spySub.disableGlobal()).once();
	});

});
