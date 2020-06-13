import ModelMediator from "@/model/ModelMediator";
import ModelMediatorImpl from "@/model/ModelMediatorImpl";
import ScopeImpl from "@/model/ScopeImpl";
import Mvvm from "@/mvvm/Mvvm";
import MvvmImpl from "@/mvvm/MvvmImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { instance, mock, spy, verify } from "ts-mockito";

const IDENTITY_FN: (input: any) => any = (input: any) => input;

const EMPTY_FN = function() { /**/ };
const mvvmStub: Mvvm = mock(MvvmImpl);
const expression: string = "expression";
const target: string = "target";

function getNewModelMediator() {
	const scope: ScopeImpl = new ScopeImpl();
	return new ModelMediatorImpl({}, expression, scope, mvvmStub, IDENTITY_FN);
	// return new ModelMediatorImpl({}, expression, mock(ScopeImpl), mvvmStub, IDENTITY_FN);
}

test("Constructor - Normal Instantation", () => {
	const specimen = getNewModelMediator();
	expect(specimen).not.toBeNull();
});

test("Constructor - null model", () => {
	const scope: ScopeImpl = new ScopeImpl();
	assertNullGuarded("model", () => new ModelMediatorImpl(null, expression, scope, mvvmStub, IDENTITY_FN));
});

test("Constructor - null expression", () => {
	const scope: ScopeImpl = new ScopeImpl();
	assertNullGuarded(expression, () => new ModelMediatorImpl({}, null, spy(scope), mvvmStub, IDENTITY_FN));
});

test("Constructor - null scope", () => {
	assertNullGuarded("scope", () => new ModelMediatorImpl({}, expression, null, mvvmStub, IDENTITY_FN));
});

test("watch() - null context", () => {
	const specimen = getNewModelMediator();
	assertNullGuarded("context", () => specimen.watch(null, EMPTY_FN));
});

test("watch() - null target", () => {
	assertNullGuarded(target, () => getNewModelMediator().watch({}, null));
});

test("evaluate(): boolean", () => {
	const specimen: ModelMediator<any> = getNewModelMediator();
	const result = specimen.evaluate();
	expect(result).toEqual(false);
});

test("notify(): void", () => {
	const specimen: ModelMediator<any> = getNewModelMediator();
	const spyMmed = spy(specimen);
	specimen.notify();
	verify(spyMmed.notify()).once();
});

test("dispose(): void", () => {
	const specimen: ModelMediator<any> = getNewModelMediator();
	const spyMmed = spy(specimen);
	specimen.dispose();
	verify(spyMmed.dispose()).once();
});
