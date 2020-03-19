import ModelMediator from "@/model/ModelMediator";
import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import EventElementMediator from "@/element/EventElementMediator";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import { Modules } from "@/module/Modules";

describe("EventElementMediator tests", () => {

	const dependencies: ElementMediatorDependencies = {
		el: null,
		expression: "true",
		model: null,
		mvvm: null,
		parent: null,
		prefix: "prefix"
	};

	const eventKey: string = "Bubba";

	it("Constructor - null dependencies", () => {
		const specimen: EventElementMediator = new EventElementMediator(dependencies);
		assert.isNotNull(specimen);
	});

	xit("wire()", () => {
		const specimen: EventElementMediator = new EventElementMediator(dependencies);
		const spySpecimen = spy(specimen);
		specimen.setEventKey(eventKey);
		specimen.wire();
		verify(spySpecimen.wire()).once();
	});

	it("unwire()", () => {
		const specimen: EventElementMediator = new EventElementMediator(dependencies);
		const spySpecimen: EventElementMediator = spy(specimen);
		specimen.unwire();
		verify(spySpecimen.unwire()).once();
	});

	it("setEventKey() - " + eventKey, () => {
		const specimen: EventElementMediator = new EventElementMediator(dependencies);
		const spySpecimen: EventElementMediator = spy(specimen);
		specimen.setEventKey(eventKey);
		verify(spySpecimen.setEventKey(eventKey)).once();
	});

});
