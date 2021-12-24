import Invoker from 'mediator/Invoker';
import ScopeImpl from 'scope/ScopeImpl';

test("Constructor - Normal Instantation", () => {
	const instance: Invoker = new Invoker("true");
	expect(instance).not.toBeNull();
});

test("invoke() called", () => {
	const instance: Invoker = new Invoker("true");
	const wkSpy: Invoker = jest.spyOn(instance, "invoke");
	const scope: ScopeImpl = new ScopeImpl();
	const testFnName: string = "whackadoodle";
	const testFn: () => any = () => "testing";
	scope.add(testFnName, testFn);
	instance.invoke(scope, testFnName);
	expect(wkSpy).toBeCalledTimes(1);
});
