import Broker from "@/message/Broker";
import BrokerImpl from "@/message/BrokerImpl";
import Listener from "@/message/Listener";
import ListenerImpl from "@/message/ListenerImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { mock, spy, verify } from "ts-mockito";

const context: any = {
	handler: function(payload: any) {
		this.value = payload;
	},
	value: "bat"
};
const CNAME: string = "channelName";

describe("BrokerImpl tests", () => {

	it("new BrokerImpl() -  not null", () => {
		assert.isNotNull(new BrokerImpl());
	});

	it("dispose", () => {
		const instance: Broker = new BrokerImpl();
		const instanceSpy = spy(instance);
		instance.dispose();
		verify(instanceSpy.dispose()).once();
	});

	it("addListener()", () => {
		const instance: Broker = new BrokerImpl();
		const instanceSpy = spy(instance);
		const listener: ListenerImpl = new ListenerImpl(CNAME, context);
		instance.addListener(listener);
		verify(instanceSpy.addListener(listener)).once();
	});

	it("removeListener()", () => {
		const instance: Broker = new BrokerImpl();
		const instanceSpy = spy(instance);
		const listener: ListenerImpl = new ListenerImpl(CNAME, context);
		instance.addListener(listener);
		verify(instanceSpy.addListener(listener)).once();
		instance.removeListener(listener);
		verify(instanceSpy.removeListener(listener)).once();
	});

	it("broadcast()", () => {
		const instance: Broker = new BrokerImpl();
		const instanceSpy = spy(instance);
		const listener: ListenerImpl = new ListenerImpl(CNAME, context);
		instance.addListener(listener);
		verify(instanceSpy.addListener(listener)).once();
		instance.broadcast(CNAME, "whatever", "doing things");
		verify(instanceSpy.broadcast(CNAME, "whatever", "doing things")).once();
	});

});
