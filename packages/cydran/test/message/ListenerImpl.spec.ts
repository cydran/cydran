import ListenerImpl from 'message/ListenerImpl';

function getTargetThis() {
	return {
		handler: function(payload: any) {
			this.value = payload;
		},
		value: "bat"
	};
}

test("Correct message consumed", () => {
	const targetThis: any = getTargetThis();
	const listener: ListenerImpl = new ListenerImpl(() => targetThis);
	listener.register("messageName", targetThis.handler);
	listener.receive("messageName", "baz");

	expect(targetThis.value).toEqual("baz");
});
