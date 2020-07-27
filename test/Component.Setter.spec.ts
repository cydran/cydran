import { mock, spy, verify } from "ts-mockito";
import { ScopeImpl, Setter } from '@/Component';

test("new Setter(expression)", () => {
	const testInstance = new Setter("x = 1");
	expect(testInstance).not.toBeNull();
});

test("set(scope, value)", () => {
	const testInstance = new Setter("x = 1");
	const spyScope = spy(new ScopeImpl());
	const spySetter: Setter<any> = spy(testInstance);
	testInstance.set(spyScope, "bubba");
	verify(spySetter.set(spyScope, "bubba")).once();
	testInstance.set(new ScopeImpl(), "bubba");
});
