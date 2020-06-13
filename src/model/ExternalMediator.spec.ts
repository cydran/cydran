import ExternalMediator from "@/model/ExternalMediator";
import ScopeImpl from "@/model/ScopeImpl";
import { spy, verify } from "ts-mockito";

const exp: string = "x = 1";

test("new ExternalMediator(expression)", () => {
	const specimen = new ExternalMediator(exp);
	expect(specimen).not.toBeNull();
});

test("set(scope: ScopeImpl, value: T): void", () => {
	const specimen = new ExternalMediator(exp);
	const scope = new ScopeImpl();
	const val = "xyz";
	const spyExternalMediator: ExternalMediator<any> = spy(specimen);
	specimen.set(scope, val);
	verify(spyExternalMediator.set(scope, val)).once();
	specimen.get(new ScopeImpl());
});

test("get(scope: ScopeImpl, value: T): void", () => {
	const specimen = new ExternalMediator(exp);
	const scope = new ScopeImpl();
	const val = "xyz";
	const spyExternalMediator: ExternalMediator<any> = spy(specimen);
	specimen.set(scope, val);
	verify(spyExternalMediator.set(scope, val)).once();
	const result = specimen.get(scope);
	expect(result).toBeNull();
	verify(spyExternalMediator.get(scope)).once();
});
