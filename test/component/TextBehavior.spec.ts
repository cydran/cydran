import { JSDOM } from "jsdom";
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import TextBehavior from 'behavior/core/TextBehavior';
import BehaviorTransitions from "behavior/BehaviorTransitions";
import RootContextImpl from 'context/RootContextImpl';
import ServicesImpl from 'service/ServicesImpl';
import PropertiesImpl from 'properties/PropertiesImpl';

const windowInstance = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;

const dependencies: BehaviorDependencies = {
	el: windowInstance.document.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	context: new RootContextImpl(),
	validated: false,
	mutable: true,
	services: new ServicesImpl(new PropertiesImpl())
};

test("Constructor - with dependencies", () => {
	const specimen = new TextBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);
	expect(specimen).not.toBeNull();
});
