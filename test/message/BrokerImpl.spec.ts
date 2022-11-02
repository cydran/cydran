import { mock, spy, verify } from "ts-mockito";
import BrokerImpl from 'message/BrokerImpl';
import Broker from 'message/Broker';
import LoggerFactory from "log/LoggerFactory";
import LoggerFactoryImpl from "log/LoggerFactoryImpl";
import PropertiesImpl from 'properties/PropertiesImpl';
import { Properties } from 'properties/Property';
import MessageCallback from 'message/MessageCallback';

const targetThis: any = {
	handler: function(payload: any) {
		this.value = payload;
	},
	value: "bat"
};

const targetThisFn: () => any = () => targetThis;
const properties: Properties = new PropertiesImpl();
const lf: LoggerFactory = new LoggerFactoryImpl(properties);
const CHANNEL_NAME: string = "channelName";

const CALLBACK: MessageCallback = (channelName: string, messageName: string, payload: any) => {
	// TODO - Do something
};

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

test("addMessageCallback()", () => {
	// TODO - Correct listener implementation from being passed and the correct object instead
	const instanceSpy = spy(specimen);
	specimen.addMessageCallback(CALLBACK);
	verify(instanceSpy.addMessageCallback(CALLBACK)).once();
});

test("removeMessageCallback()", () => {
	// TODO - Correct listener implementation from being passed and the correct object instead
	const instanceSpy = spy(specimen);
	specimen.addMessageCallback(CALLBACK);
	verify(instanceSpy.addMessageCallback(CALLBACK)).once();
	specimen.removeMessageCallback(CALLBACK);
	verify(instanceSpy.removeMessageCallback(CALLBACK)).once();
});

test("send()", () => {
	// TODO - Correct listener implementation from being passed and the correct object instead
	const instanceSpy = spy(specimen);
	specimen.addMessageCallback(CALLBACK);
	verify(instanceSpy.addMessageCallback(CALLBACK)).once();
	specimen.send(CHANNEL_NAME, "whatever", "doing things");
	verify(instanceSpy.send(CHANNEL_NAME, "whatever", "doing things")).once();
});
