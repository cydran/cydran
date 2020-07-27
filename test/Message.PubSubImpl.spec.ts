import { assertNoErrorThrown, assertNullGuarded } from "@/TestUtils";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { Component, ModulesContextImpl } from "@/Component";
import { PubSubImpl } from "@/Message";
import { Module, PubSub } from '@/Interfaces';

class TestComponent extends Component {

	private wkvalue: string;

	constructor() {
		super("<div>{{m().wkvalue}}</div>");
	}

	protected init() {
		this.wkvalue = "Test Value";
	}

}

const module: Module = new ModulesContextImpl().getDefaultModule();

test("message() - null channelName", () => {
	assertNullGuarded("channelName", () => new PubSubImpl({}, module).message(null, "messageName", "payload"));
});

test("message() - null messageName", () => {
	assertNullGuarded("messageName", () => new PubSubImpl({}, module).message("channelName", null, "payload"));
});

test("message() - null payload", () => {
	assertNoErrorThrown(() => new PubSubImpl({}, module).message("channelName", "messageName", null));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded("channelName", () => new PubSubImpl({}, module).broadcast(null, "messageName", "payload"));
});

test("broadcast() - null messageName", () => {
	assertNullGuarded("messageName", () => new PubSubImpl({}, module).broadcast("channelName", null, "payload"));
});

test("broadcast() - null payload", () => {
	assertNoErrorThrown(() => new PubSubImpl({}, module).broadcast("channelName", "messageName", null));
});

test("broadcastGlobally() - null channelName", () => {
	assertNullGuarded("channelName", () => new PubSubImpl({}, module).broadcastGlobally(null, "messageName", "payload"));
});

test("broadcastGlobally() - null messageName", () => {
	assertNullGuarded("messageName", () => new PubSubImpl({}, module).broadcastGlobally("channelName", null, "payload"));
});

test("broadcastGlobally() - null payload", () => {
	assertNoErrorThrown(() => new PubSubImpl({}, module).broadcastGlobally("channelName", "messageName", null));
});

test("on() - null messageName", () => {
	assertNullGuarded("messageName", () => new PubSubImpl({}, module).on(null));
});

test("on().forChannel() - null channelName", () => {
	assertNullGuarded("channelName", () => new PubSubImpl({}, module).on("messageName").forChannel(null));
});

test("on().forChannel().invoke() - null target", () => {
	assertNullGuarded("target", () => new PubSubImpl({}, module).on("messageName").forChannel("channelName").invoke(null));
});

test("on().invoke() - null target", () => {
	assertNullGuarded("target", () => new PubSubImpl({}, module).on("messageName").invoke(null));
});

test("enableGlobal()", () => {
	const specimen: PubSub = new PubSubImpl({}, module);
	const spySub: PubSub = spy(specimen);
	specimen.enableGlobal();
	verify(spySub.enableGlobal()).once();
});

test("disableGlobal()", () => {
	const specimen: PubSub = new PubSubImpl({}, module);
	const spySub: PubSub = spy(specimen);
	specimen.enableGlobal();
	verify(spySub.enableGlobal()).once();
	specimen.disableGlobal();
	verify(spySub.disableGlobal()).once();
});
