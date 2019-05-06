import {assert} from "chai";
import {describe, it} from "mocha";
import Listener from "./Listener";
import ListenerImpl from "./ListenerImpl";

describe("ListenerImpl tests", () => {

	it("Correct message consumed", () => {

		const context: any = {
			handler: function(payload: any) {
				this.value = payload;
			},
			value: "bat",
		};

		const listener: Listener = new ListenerImpl("channelName", context);
		listener.register("messageName", context.handler);
		listener.receive("messageName", "baz");

		assert.equal(context.value, "baz");
	});

});
