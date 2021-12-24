import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import BehaviorsRegistry from 'behavior/BehaviorsRegistry';
import CheckedBehavior from 'behavior/core/CheckedBehavior';

test("Factories not null", () => {
	expect(BehaviorsRegistry).not.toBeNull();
});

test("register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void", () => {
	const spyFactories: BehaviorsRegistry = spy(BehaviorsRegistry);
	BehaviorsRegistry.register("checked", ["input"], CheckedBehavior);

	expect(BehaviorsRegistry.lookup("checked", "input")).not.toBeNull();
});
