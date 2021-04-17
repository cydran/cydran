import { JSDOM } from "jsdom";
import { assertNoErrorThrown, assertNullGuarded } from "./TestUtils";
import { mock, spy, verify } from "ts-mockito";
import ElementMediatorDependencies from 'mediator/ElementMediatorDependencies';
import ModulesContextImpl from 'module/ModulesContextImpl';
import TextElementMediator from 'mediator/TextElementMediator';

const doc = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window.document;

const dependencies: ElementMediatorDependencies = {
	el: doc.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	mediatorPrefix: "mediatorPrefix",
	module: new ModulesContextImpl().getDefaultModule(),
	validated: false,
	mutable: true
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
