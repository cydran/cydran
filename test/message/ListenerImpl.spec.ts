import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import ListenerImpl from 'message/ListenerImpl';

function getContext() {
	return {
		handler: function(payload: any) {
			this.value = payload;
		},
		value: "bat"
	};
}

const CHNL_NAME: string = "channelName";

test("Correct message consumed", () => {
	const context: any = getContext();
	const listener: ListenerImpl = new ListenerImpl(CHNL_NAME, () => context);
	listener.register("messageName", context.handler);
	listener.receive("messageName", "baz");

	expect(context.value).toEqual("baz");
});

test("Assure name is correct - .getChannelName()", () => {
	const context: any = getContext();
	const listener: ListenerImpl = new ListenerImpl(CHNL_NAME, () => context);

	expect(listener.getChannelName()).toEqual(CHNL_NAME);
});
