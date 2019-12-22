import { assert, expect } from "chai";
import { describe, it } from "mocha";
import Mockito from "ts-mockito";
import { anything, instance, mock, verify, when, spy } from "ts-mockito";
import ListenerImpl from "@/messaging/ListenerImpl";

describe("ListenerImpl tests", () => {

	it("Correct message consumed", () => {

		const context: any = {
			handler: function(payload: any) {
				this.value = payload;
			},
			value: "bat",
		};

		const listener: ListenerImpl = new ListenerImpl("channelName", context);
		listener.register("messageName", context.handler);
		listener.receive("messageName", "baz");

		assert.equal(context.value, "baz");
	});

	it("Assure dispose occurs correctly", () => {

		const context: any = {
			handler: function(payload: any) {
				this.value = payload;
			},
			value: "bat",
		};

		const listener: ListenerImpl = new ListenerImpl("channelName", context);
		const lspy: ListenerImpl = spy(listener);

		listener.register("messageName", context.handler);
		listener.receive("messageName", "baz");

		assert.equal(context.value, "baz");
		listener.dispose();
		verify(lspy.dispose()).once();

	});

});
