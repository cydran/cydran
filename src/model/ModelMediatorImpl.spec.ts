import Component from "@/component/Component";
import { MODULE_FIELD_NAME } from "@/constant/Constants";
import Getter from "@/model/Getter";
import ModelMediator from "@/model/ModelMediator";
import ModelMediatorImpl from "@/model/ModelMediatorImpl";
import ScopeImpl from "@/model/ScopeImpl";
import Mvvm from "@/mvvm/Mvvm";
import MvvmImpl from "@/mvvm/MvvmImpl";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it } from "mocha";
import { instance, mock, spy, verify } from "ts-mockito";

const IDENTITY_FN: (input: any) => any = (input: any) => input;

describe("ModelMediatorImpl tests", () => {

	const EMPTY_FN = function() { /**/ };
	const mvvmStub: Mvvm = mock(MvvmImpl);
	const expression: string = "expression";
	const target: string = "target";

	function getNewModelMediator() {
		const scope: ScopeImpl = new ScopeImpl();
		return new ModelMediatorImpl({}, expression, mock(ScopeImpl), mvvmStub, IDENTITY_FN);
	}

	it("Constructor - Normal Instantation", () => {
		const specimen = getNewModelMediator();
		assert.isNotNull(specimen, "is null");
	});

	it("Constructor - null model", () => {
		const scope: ScopeImpl = new ScopeImpl();
		assertNullGuarded("model", () => new ModelMediatorImpl(null, expression, scope, mvvmStub, IDENTITY_FN));
	});

	it("Constructor - null expression", () => {
		const scope: ScopeImpl = new ScopeImpl();
		assertNullGuarded(expression, () => new ModelMediatorImpl({}, null, spy(scope), mvvmStub, IDENTITY_FN));
	});

	it("Constructor - null scope", () => {
		assertNullGuarded("scope", () => new ModelMediatorImpl({}, expression, null, mvvmStub, IDENTITY_FN));
	});

	it("watch() - null context", () => {
		const specimen = getNewModelMediator();
		assertNullGuarded("context", () => specimen.watch(null, EMPTY_FN));
	});

	it("watch() - null target", () => {
		assertNullGuarded(target, () => getNewModelMediator().watch({}, null));
	});

	it("get(): T - is null", () => {
		const specimen: ModelMediator<any> = getNewModelMediator();
		const spyMmed = spy(specimen);
		const result = specimen.get();
		assert.isNull(result);
		verify(spyMmed.get()).once();
	});

	it("set(value: any): void", () => {
		const specimen: ModelMediator<any> = getNewModelMediator();
		const spyMmed = spy(specimen);
		const tval = "myvalue";
		specimen.set(tval);
		verify(spyMmed.set(tval)).once();
	});

	it("invoke(params?: any): void", () => {
		const specimen: ModelMediator<any> = getNewModelMediator();
		const spyMmed = spy(specimen);
		const params = { bubba: "params" };
		specimen.invoke();
		specimen.invoke(params);
		verify(spyMmed.invoke()).once();
		verify(spyMmed.invoke(params)).once();
	});

	it("evaluate(): boolean", () => {
		const specimen: ModelMediator<any> = getNewModelMediator();
		const spyMmed = spy(specimen);
		const params = { bubba: "params" };
		specimen.invoke();
		specimen.invoke(params);
		verify(spyMmed.invoke()).once();
		verify(spyMmed.invoke(params)).once();
		const result = specimen.evaluate();
		assert.isFalse(result);
	});

	it("notify(): void", () => {
		const specimen: ModelMediator<any> = getNewModelMediator();
		const spyMmed = spy(specimen);
		specimen.notify();
		verify(spyMmed.notify()).once();
	});

	it("dispose(): void", () => {
		const specimen: ModelMediator<any> = getNewModelMediator();
		const spyMmed = spy(specimen);
		specimen.dispose();
		verify(spyMmed.dispose()).once();
	});

});
