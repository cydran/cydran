import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import EventElementMediator from "mediator/core/EventElementMediator";

test("Constructor", () => {
	const specimen: EventElementMediator = new EventElementMediator();
	expect(specimen).not.toBeNull();
});
