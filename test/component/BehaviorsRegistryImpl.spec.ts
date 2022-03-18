import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import BehaviorsRegistryImpl from 'behavior/BehaviorsRegistryImpl';
import CheckedBehavior from 'behavior/core/CheckedBehavior';
import { JSDOM } from 'jsdom';

const el: HTMLElement = new JSDOM(`<div></div>`).window.document.createElement("div");

test("register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void", () => {
	const specimen: BehaviorsRegistryImpl = new BehaviorsRegistryImpl();
	specimen.register("checked", ["input"], CheckedBehavior);

	expect(specimen.lookup(el, "checked", "input")).not.toBeNull();
});
