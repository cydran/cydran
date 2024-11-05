import ListenerImpl from 'message/ListenerImpl';
import { describe, expect, test } from '@jest/globals';

function getThisObject() {
	return {
		handler: function (payload: any) {
			this.value = payload;
		},
		value: "bat"
	};
}

describe("ListenerImpl", () => {

	test("Correct message consumed", () => {
		const thisObject: any = getThisObject();
		const listener: ListenerImpl = new ListenerImpl(() => thisObject);
		listener.register("messageName", thisObject.handler);
		listener.receive("messageName", "baz");

		expect(thisObject.value).toEqual("baz");
	});

});
