import BrokerImpl from 'message/BrokerImpl';
import Broker from 'message/Broker';
import LoggerFactory from "log/LoggerFactory";
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
	const instanceSpy = jest.spyOn(specimen, '$dispose');
	specimen.$dispose();
	expect(instanceSpy).toHaveBeenCalledTimes(1);
});

test("addMessageCallback()", () => {
	// TODO - Correct listener implementation from being passed and the correct object instead
	const instanceSpy = jest.spyOn(specimen, 'addMessageCallback');
	specimen.addMessageCallback(CALLBACK);
	expect(instanceSpy).toHaveBeenCalledTimes(1);
	expect(instanceSpy).toHaveBeenCalledWith(CALLBACK);
});

test("removeMessageCallback()", () => {
	// TODO: Correct listener implementation from being passed and the correct object instead
	const iSpy1 = jest.spyOn(specimen, 'addMessageCallback');
	const iSpy2 = jest.spyOn(specimen, 'removeMessageCallback');
	specimen.addMessageCallback(CALLBACK);
	specimen.removeMessageCallback(CALLBACK);
	expect(iSpy1).toHaveBeenCalledTimes(1);
	expect(iSpy1).toHaveBeenCalledWith(CALLBACK);
	expect(iSpy2).toHaveBeenCalledTimes(1);
	expect(iSpy2).toHaveBeenCalledWith(CALLBACK);
});

test("send()", () => {
	// TODO - Correct listener implementation fr
	const instanceSpy = jest.spyOn(specimen, ['send']);
	specimen.addMessageCallback(CALLBACK);
	specimen.send(CHANNEL_NAME, "whatever", "doing things");
	expect(instanceSpy).toHaveBeenCalledTimes(1);
	expect(instanceSpy).toHaveBeenLastCalledWith(CHANNEL_NAME, "whatever", "doing things");
});
