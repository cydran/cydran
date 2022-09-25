import { JSDOM } from "jsdom";
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import TextBehavior from 'behavior/core/TextBehavior';
import BehaviorTransitions from "behavior/BehaviorTransitions";
import ContextImpl from 'context/ContextImpl';

const windowInstance = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;

const dependencies: BehaviorDependencies = {
	el: windowInstance.document.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	context: new ContextImpl(),
	validated: false,
	mutable: true
};

test("Constructor - with dependencies", () => {
	const specimen = new TextBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);
	expect(specimen).not.toBeNull();
});
