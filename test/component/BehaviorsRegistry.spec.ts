import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import BehaviorsRegistry from 'behavior/BehaviorsRegistry';
import CheckedBehavior from 'behavior/core/CheckedBehavior';

test("Factories not null", () => {
	expect(BehaviorsRegistry).not.toBeNull();
});

test.skip("register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void", () => {
	const spyFactories: BehaviorsRegistry = spy(BehaviorsRegistry);
	BehaviorsRegistry.register("checked", ["input"], CheckedBehavior);
	// TODO: verify(spyFactories.register("checked", ["input"], Checked)).once();
});

test.skip("get<T>(type: string): T", () => {
	const spyFactories: BehaviorsRegistry = spy(BehaviorsRegistry);
	BehaviorsRegistry.register("checked", ["input"], CheckedBehavior);
	// TODO: verify(spyFactories.register("checked", ["input"], Checked)).once();
});
