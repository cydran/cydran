import { spy, verify } from "ts-mockito";
import Invoker from 'mediator/Invoker';
import ScopeImpl from 'scope/ScopeImpl';

it("Constructor - Normal Instantation", () => {
	const instance: Invoker = new Invoker("true");
	expect(instance).not.toBeNull();
});

it("invoike() called", () => {
	const instance: Invoker = new Invoker("true");
	const spyInstance: Invoker = spy(instance);
	const scope: ScopeImpl = new ScopeImpl();
	const params = {};
	instance.invoke(scope, params);
	verify(spyInstance.invoke(scope, params)).once();
});
