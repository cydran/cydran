import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import Factories from 'internals/Factories';
import Checked from 'behavior/core/Checked';

test("Factories not null", () => {
	expect(Factories).not.toBeNull();
});

test.skip("register(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void", () => {
	const spyFactories: Factories = spy(Factories);
	Factories.register("checked", ["input"], Checked);
	// TODO: verify(spyFactories.register("checked", ["input"], Checked)).once();
});

test.skip("get<T>(type: string): T", () => {
	const spyFactories: Factories = spy(Factories);
	Factories.register("checked", ["input"], Checked);
	// TODO: verify(spyFactories.register("checked", ["input"], Checked)).once();
});
