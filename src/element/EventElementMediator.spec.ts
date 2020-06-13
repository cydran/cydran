import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import EventElementMediator from "@/element/EventElementMediator";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";

const dependencies: ElementMediatorDependencies = {
	el: null,
	expression: "true",
	model: null,
	mvvm: null,
	parent: null,
	prefix: "prefix",
	module: null
};

const eventKey: string = "Bubba";

test("Constructor - null dependencies", () => {
	const specimen: EventElementMediator = new EventElementMediator(dependencies);
	expect(specimen).not.toBeNull();
});

test.skip("wire()", () => {
	const specimen: EventElementMediator = new EventElementMediator(dependencies);
	const spySpecimen = spy(specimen);
	specimen.setEventKey(eventKey);
	specimen.wire();
	verify(spySpecimen.wire()).once();
});

test("unwire()", () => {
	const specimen: EventElementMediator = new EventElementMediator(dependencies);
	const spySpecimen: EventElementMediator = spy(specimen);
	specimen.unwire();
	verify(spySpecimen.unwire()).once();
});

test("setEventKey() - " + eventKey, () => {
	const specimen: EventElementMediator = new EventElementMediator(dependencies);
	const spySpecimen: EventElementMediator = spy(specimen);
	specimen.setEventKey(eventKey);
	verify(spySpecimen.setEventKey(eventKey)).once();
});
