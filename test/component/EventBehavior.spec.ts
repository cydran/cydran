import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import EventBehavior from "behavior/EventBehavior";

test("Constructor", () => {
	const specimen: EventBehavior = new EventBehavior();
	expect(specimen).not.toBeNull();
});
