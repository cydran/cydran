import { ElementMediatorDependencies } from "@/Interfaces";
import { JSDOM } from "jsdom";
import { assertNoErrorThrown, assertNullGuarded } from "@/TestUtils";
import { mock, spy, verify } from "ts-mockito";
import { MvvmImpl, TextElementMediator } from '@/Component';

const doc = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window.document;

const dependencies: ElementMediatorDependencies = {
	el: doc.querySelector("div"),
	expression: "true",
	model: {},
	mvvm: mock(MvvmImpl),
	parent: null,
	prefix: "prefix",
	module: null
};

test("Constructor - null dependencies", () => {
	assertNullGuarded("dependencies", () => new TextElementMediator(null));
});

test("Constructor - with dependencies", () => {
	const tem = new TextElementMediator(dependencies);
	expect(tem).not.toBeNull();
});

test.skip("wire()", () => {
	const tem = new TextElementMediator(dependencies);
	const spyTem = spy(tem);
	expect(tem).not.toBeNull();
	// tem.wire();
	// verify(spyTem.wire()).once();
});

test("unwire()", () => {
	const tem = new TextElementMediator(dependencies);
	const spyTem = spy(tem);
	expect(tem).not.toBeNull();
	tem.unwire();
	verify(spyTem.unwire()).once();
});
