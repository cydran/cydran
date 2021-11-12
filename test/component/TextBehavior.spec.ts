import { JSDOM } from "jsdom";
import { assertNoErrorThrown, assertNullGuarded } from "test/TestUtils";
import { mock, spy, verify } from "ts-mockito";
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import ModulesContextImpl from 'module/ModulesContextImpl';
import TextBehavior from 'behavior/core/TextBehavior';
import BehaviorTransitions from "behavior/BehaviorTransitions";
import DomImpl from 'dom/DomImpl';

const windowInstance = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;

const dependencies: BehaviorDependencies = {
	el: windowInstance.document.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	module: new ModulesContextImpl(new DomImpl(windowInstance)).getDefaultModule(),
	validated: false,
	mutable: true
};

test("Constructor - with dependencies", () => {
	const specimen = new TextBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);
	expect(specimen).not.toBeNull();
});

