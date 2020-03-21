import Component from "@/component/Component";
import { MODULE_FIELD_NAME } from "@/constant/Constants";
import ElementMediatorDependencies from "@/element/ElementMediatorDependencies";
import MvvmImpl from "@/mvvm/MvvmImpl";
import ScopeImpl from "@/model/ScopeImpl";
import TextElementMediator from "@/element/TextElementMediator";
import { JSDOM } from "jsdom";
import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { mock, spy, verify } from "ts-mockito";

const doc = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window.document;

describe("TextElementMediator tests", () => {

	const dependencies: ElementMediatorDependencies = {
		el: doc.querySelector("div"),
		expression: "true",
		model: {},
		mvvm: mock(MvvmImpl),
		parent: null,
		prefix: "prefix"
	};

	it("Constructor - null dependencies", () => {
		assertNullGuarded("dependencies", () => new TextElementMediator(null));
	});

	it("Constructor - with dependencies", () => {
		const tem = new TextElementMediator(dependencies);
		assert.isNotNull(tem);
	});

	xit("wire()", () => {
		const tem = new TextElementMediator(dependencies);
		const spyTem = spy(tem);
		assert.isNotNull(tem);
		// tem.wire();
		// verify(spyTem.wire()).once();
	});

	it("unwire()", () => {
		const tem = new TextElementMediator(dependencies);
		const spyTem = spy(tem);
		assert.isNotNull(tem);
		tem.unwire();
		verify(spyTem.unwire()).once();
	});

});
