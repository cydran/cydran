import ListenerImpl from "@/message/ListenerImpl";
import { assert, expect } from "chai";
import { describe, it } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";

function getContext() {
	return {
		handler: function(payload: any) {
			this.value = payload;
		},
		value: "bat"
	};
}

describe("ListenerImpl tests", () => {

	const CHNL_NAME: string = "channelName";

	it("Correct message consumed", () => {
		const context: any = getContext();
		const listener: ListenerImpl = new ListenerImpl(CHNL_NAME, context);
		listener.register("messageName", context.handler);
		listener.receive("messageName", "baz");

		assert.equal(context.value, "baz");
	});

	it("Assure dispose occurs correctly", () => {
		const context: any = getContext();
		const listener: ListenerImpl = new ListenerImpl(CHNL_NAME, context);
		const lspy: ListenerImpl = spy(listener);
		listener.register("messageName", context.handler);
		listener.receive("messageName", "baz");

		assert.equal(context.value, "baz");
		listener.dispose();
		verify(lspy.dispose()).once();

	});

	it("Assure name is correct - .getChannelName()", () => {
		const context: any = getContext();
		const listener: ListenerImpl = new ListenerImpl(CHNL_NAME, context);

		assert.equal(CHNL_NAME, listener.getChannelName(), "name is not the same");
	});

});
