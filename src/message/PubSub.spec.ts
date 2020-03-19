import PubSub from "@/message/PubSub";
import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import Component from "@/component/Component";

class TestComponent extends Component {

	private wkvalue: string;

	constructor() {
		super("<div>{{m().wkvalue}}</div>");
	}

	protected init() {
		this.wkvalue = "Test Value";
	}

}

describe("PubSub tests", () => {

	it("Constructor - null context", () => {
		assertNullGuarded("context", () => new PubSub(null));
	});

	it("message() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSub({}).message(null, "messageName", "payload"));
	});

	it("message() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSub({}).message("channelName", null, "payload"));
	});

	it("message() - null payload", () => {
		assertNoErrorThrown(() => new PubSub({}).message("channelName", "messageName", null));
	});

	it("broadcast() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSub({}).broadcast(null, "messageName", "payload"));
	});

	it("broadcast() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSub({}).broadcast("channelName", null, "payload"));
	});

	it("broadcast() - null payload", () => {
		assertNoErrorThrown(() => new PubSub({}).broadcast("channelName", "messageName", null));
	});

	it("broadcastGlobally() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSub({}).broadcastGlobally(null, "messageName", "payload"));
	});

	it("broadcastGlobally() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSub({}).broadcastGlobally("channelName", null, "payload"));
	});

	it("broadcastGlobally() - null payload", () => {
		assertNoErrorThrown(() => new PubSub({}).broadcastGlobally("channelName", "messageName", null));
	});

	it("on() - null messageName", () => {
		assertNullGuarded("messageName", () => new PubSub({}).on(null));
	});

	it("on().forChannel() - null channelName", () => {
		assertNullGuarded("channelName", () => new PubSub({}).on("messageName").forChannel(null));
	});

	it("on().forChannel().invoke() - null target", () => {
		assertNullGuarded("target", () => new PubSub({}).on("messageName").forChannel("channelName").invoke(null));
	});

	it("on().invoke() - null target", () => {
		assertNullGuarded("target", () => new PubSub({}).on("messageName").invoke(null));
	});

	it("enableGlobal()", () => {
		const instance: PubSub = new PubSub({});
		const spySub: PubSub = spy(instance);
		instance.enableGlobal();
		verify(spySub.enableGlobal()).once();
	});

	it("disableGlobal()", () => {
		const instance: PubSub = new PubSub({});
		const spySub: PubSub = spy(instance);
		instance.enableGlobal();
		verify(spySub.enableGlobal()).once();
		instance.disableGlobal();
		verify(spySub.disableGlobal()).once();
	});

});
