import EventBehavior from "behavior/EventBehavior";

test("Constructor", () => {
	const specimen: EventBehavior = new EventBehavior("click");
	expect(specimen).not.toBeNull();
});
