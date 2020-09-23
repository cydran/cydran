import { BrokerImpl, ListenerImpl } from "@/Message";
import { mock, spy, verify } from "ts-mockito";
import { Broker } from '@/Interfaces';

const context: any = {
	handler: function(payload: any) {
		this.value = payload;
	},
	value: "bat"
};

const CHANNEL_NAME: string = "channelName";

test("new BrokerImpl() -  not null", () => {
	expect(new BrokerImpl()).not.toBeNull();
});

test("dispose", () => {
	const instance: Broker = new BrokerImpl();
	const instanceSpy = spy(instance);
	instance.$dispose();
	verify(instanceSpy.$dispose()).once();
});

test("addListener()", () => {
	const instance: Broker = new BrokerImpl();
	const instanceSpy = spy(instance);
	const listener: ListenerImpl = new ListenerImpl(CHANNEL_NAME, context);
	instance.addListener(listener);
	verify(instanceSpy.addListener(listener)).once();
});

test("removeListener()", () => {
	const instance: Broker = new BrokerImpl();
	const instanceSpy = spy(instance);
	const listener: ListenerImpl = new ListenerImpl(CHANNEL_NAME, context);
	instance.addListener(listener);
	verify(instanceSpy.addListener(listener)).once();
	instance.removeListener(listener);
	verify(instanceSpy.removeListener(listener)).once();
});

test("broadcast()", () => {
	const instance: Broker = new BrokerImpl();
	const instanceSpy = spy(instance);
	const listener: ListenerImpl = new ListenerImpl(CHANNEL_NAME, context);
	instance.addListener(listener);
	verify(instanceSpy.addListener(listener)).once();
	instance.broadcast(CHANNEL_NAME, "whatever", "doing things");
	verify(instanceSpy.broadcast(CHANNEL_NAME, "whatever", "doing things")).once();
});
