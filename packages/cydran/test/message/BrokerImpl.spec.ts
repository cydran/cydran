import { spy, verify } from "ts-mockito";
import { test, beforeEach, afterEach, expect } from "@jest/globals";
import BrokerImpl from 'message/BrokerImpl';
import Broker from 'message/Broker';
import LoggerFactory from "log/LoggerFactory";
import { Properties } from 'properties/Property';
import MessageCallback from 'message/MessageCallback';
import PropertiesAlternativeImpl from 'properties/PropertiesAlternativeImpl';

const targetThis: any = {
	handler: function(payload: any) {
		this.value = payload;
	},
	value: "bat"
};

const targetThisFn: () => any = () => targetThis;
const properties: Properties = new PropertiesAlternativeImpl();
LoggerFactory.init(properties);
const CHANNEL_NAME: string = "channelName";

const CALLBACK: MessageCallback = (channelName: string, messageName: string, payload: any) => {
	// TODO - Do something
};

let specimen: Broker = null;
beforeEach(() => {
	specimen = new BrokerImpl(LoggerFactory.getLogger(`Broker`));
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
	// TODO - Correct listener implementation from being passed and the correct object instead
	const instanceSpy = spy(specimen);
	specimen.addListener(CALLBACK);
	verify(instanceSpy.addListener(CALLBACK)).once();
});

test("removeListener()", () => {
	// TODO - Correct listener implementation from being passed and the correct object instead
	const instanceSpy = spy(specimen);
	specimen.addListener(CALLBACK);
	verify(instanceSpy.addListener(CALLBACK)).once();
	specimen.removeListener(CALLBACK);
	verify(instanceSpy.removeListener(CALLBACK)).once();
});

test("send()", () => {
	// TODO - Correct listener implementation from being passed and the correct object instead
	const instanceSpy = spy(specimen);
	specimen.addListener(CALLBACK);
	verify(instanceSpy.addListener(CALLBACK)).once();
	specimen.send(CHANNEL_NAME, "whatever", "doing things");
	verify(instanceSpy.send(CHANNEL_NAME, "whatever", "doing things")).once();
});
