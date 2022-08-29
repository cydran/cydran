import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import ListenerImpl from 'message/ListenerImpl';

function getTargetThis() {
	return {
		handler: function(payload: any) {
			this.value = payload;
		},
		value: "bat"
	};
}

const CHNL_NAME: string = "channelName";

test("Correct message consumed", () => {
	const targetThis: any = getTargetThis();
	const listener: ListenerImpl = new ListenerImpl(CHNL_NAME, () => targetThis);
	listener.register("messageName", targetThis.handler);
	listener.receive("messageName", "baz");

	expect(targetThis.value).toEqual("baz");
});

test("Assure name is correct - .getChannelName()", () => {
	const targetThis: any = getTargetThis();
	const listener: ListenerImpl = new ListenerImpl(CHNL_NAME, () => targetThis);

	expect(listener.getChannelName()).toEqual(CHNL_NAME);
});
