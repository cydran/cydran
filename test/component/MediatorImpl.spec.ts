import { assertNullGuarded } from "TestUtils";
import { instance, mock, spy, verify } from "ts-mockito";
import ScopeImpl from 'scope/ScopeImpl';
import MediatorImpl from 'mediator/MediatorImpl';
import Mediator from 'mediator/Mediator';
import { clone, equals } from 'util/Utils';

const IDENTITY_FN: (input: any) => any = (input: any) => input;

const EMPTY_FN = function() { /**/ };
const expression: string = "expression";
const target: string = "target";

function getNewMediator() {
	const scope: ScopeImpl = new ScopeImpl();
	return new MediatorImpl(
		{},
		expression,
		scope,
		IDENTITY_FN,
		(value: any) => clone(100, value),
		(first: any, second: any) => equals(100, first, second));
}

test("Constructor - Normal Instantation", () => {
	const specimen = getNewMediator();
	expect(specimen).not.toBeNull();
});

test("Constructor - null scope", () => {
	assertNullGuarded("scope", () => new MediatorImpl({}, null, new ScopeImpl(), IDENTITY_FN, null, null));
});

test("watch() - null watchContext", () => {
	const specimen = getNewMediator();
	assertNullGuarded("watchContext", () => specimen.watch(null, EMPTY_FN));
});

test("watch() - null target", () => {
	assertNullGuarded(target, () => getNewMediator().watch({}, null));
});

test("evaluate(): boolean", () => {
	const specimen: Mediator<any> = getNewMediator();
	const result = specimen.evaluate();
	expect(result).toEqual(false);
});

test("notify(): void", () => {
	const specimen: Mediator<any> = getNewMediator();
	const spyMmed = spy(specimen);
	specimen.notify();
	verify(spyMmed.notify()).once();
});

test("dispose(): void", () => {
	const specimen: Mediator<any> = getNewMediator();
	const spyMmed = spy(specimen);
	specimen.$dispose();
	verify(spyMmed.$dispose()).once();
});
