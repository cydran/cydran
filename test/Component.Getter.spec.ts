import { mock, spy, verify } from "ts-mockito";
import { Getter, ScopeImpl } from '@/Component';

test("new Getter(expression)", () => {
	const specimen = new Getter("x = 1");
	expect(specimen).not.toBeNull();
});

test("set(scope)", () => {
	const specimen = new Getter("x = 1");
	const scope = new ScopeImpl();
	scope.add("var1", "Bubba");
	const spySetter: Getter<any> = spy(specimen);
	specimen.get(scope);
	verify(spySetter.get(scope)).once();
	specimen.get(new ScopeImpl());
});
