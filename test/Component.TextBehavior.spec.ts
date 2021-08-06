import { JSDOM } from "jsdom";
import { assertNoErrorThrown, assertNullGuarded } from "./TestUtils";
import { mock, spy, verify } from "ts-mockito";
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import ModulesContextImpl from 'module/ModulesContextImpl';
import TextBehavior from 'behavior/TextBehavior';
import BehaviorTransitions from "behavior/BehaviorTransitions";

const doc = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window.document;

const dependencies: BehaviorDependencies = {
	el: doc.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	module: new ModulesContextImpl().getDefaultModule(),
	validated: false,
	mutable: true
};

test("Constructor - with dependencies", () => {
	const tem = new TextBehavior();
	tem.tell(BehaviorTransitions.INIT, dependencies);
	expect(tem).not.toBeNull();
});

