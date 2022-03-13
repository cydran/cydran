import { mock, spy, verify } from "ts-mockito";
import BrokerImpl from 'message/BrokerImpl';
import Broker from 'message/Broker';
import ListenerImpl from 'message/ListenerImpl';
import LoggerFactory from "log/LoggerFactory";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";

const context: any = {
	handler: function(payload: any) {
		this.value = payload;
	},
	value: "bat"
};
const lf: LoggerFactory = new LoggerFactoryImpl({});
const CHANNEL_NAME: string = "channelName";

let specimen: Broker = null;
beforeEach(() => {
	specimen = new BrokerImpl(lf.getLogger(`Broker`));
});

afterEach(() => {
	specimen = null;
});

test("new BrokerImpl() -  not null", () => {
	expect(specimen).not.toBeNull();
});

test("dispose", () => {
	const instanceSpy = spy(specimen);
	specimen.$dispose();
	verify(instanceSpy.$dispose()).once();
});

test("addListener()", () => {
	const instanceSpy = spy(specimen);
	const listener: ListenerImpl = new ListenerImpl(CHANNEL_NAME, context);
	specimen.addListener(listener);
	verify(instanceSpy.addListener(listener)).once();
});

test("removeListener()", () => {
	const instanceSpy = spy(specimen);
	const listener: ListenerImpl = new ListenerImpl(CHANNEL_NAME, context);
	specimen.addListener(listener);
	verify(instanceSpy.addListener(listener)).once();
	specimen.removeListener(listener);
	verify(instanceSpy.removeListener(listener)).once();
});

test("broadcast()", () => {
	const instanceSpy = spy(specimen);
	const listener: ListenerImpl = new ListenerImpl(CHANNEL_NAME, context);
	specimen.addListener(listener);
	verify(instanceSpy.addListener(listener)).once();
	specimen.broadcast(CHANNEL_NAME, "whatever", "doing things");
	verify(instanceSpy.broadcast(CHANNEL_NAME, "whatever", "doing things")).once();
});
