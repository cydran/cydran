import { JSDOM } from "jsdom";
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import ContextsImpl from 'context/ContextsImpl';
import TextBehavior from 'behavior/core/TextBehavior';
import BehaviorTransitions from "behavior/BehaviorTransitions";
import DomImpl from 'dom/DomImpl';
import Services from "service/Services";
import ServicesImpl from "service/ServicesImpl";

const windowInstance = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;

let services: Services = new ServicesImpl(new DomImpl(windowInstance), {});

const dependencies: BehaviorDependencies = {
	el: windowInstance.document.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	context: new ContextsImpl(services).getDefaultContext(),
	validated: false,
	mutable: true
};

test("Constructor - with dependencies", () => {
	const specimen = new TextBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);
	expect(specimen).not.toBeNull();
});

