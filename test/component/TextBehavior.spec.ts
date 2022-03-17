import { JSDOM } from "jsdom";
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import ModulesContextImpl from 'module/ModulesContextImpl';
import TextBehavior from 'behavior/core/TextBehavior';
import BehaviorTransitions from "behavior/BehaviorTransitions";
import DomImpl from 'dom/DomImpl';
import CydranContext from "context/CydranContext";
import CydranContextImpl from "context/CydranContextImpl";

const windowInstance = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window;

let cydranContext: CydranContext = new CydranContextImpl(new DomImpl(windowInstance), {});

const dependencies: BehaviorDependencies = {
	el: windowInstance.document.querySelector("div"),
	expression: "true",
	model: {},
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	module: new ModulesContextImpl(cydranContext).getDefaultModule(),
	validated: false,
	mutable: true
};

test("Constructor - with dependencies", () => {
	const specimen = new TextBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);
	expect(specimen).not.toBeNull();
});

