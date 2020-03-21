import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { describe, it, xit } from "mocha";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import Component from "@/component/Component";
import { MODULE_FIELD_NAME } from "@/constant/Constants";
import Mvvm from "@/mvvm/Mvvm";
import MvvmImpl from "@/mvvm/MvvmImpl";
import ScopeImpl from "@/model/ScopeImpl";

class TestComponent extends Component {
	constructor() {
		super("<div></div>");
	}

	public init(): void { /* void */ }
}

const mvvmId: string = "test_id_01";
const mvvmPrefix: string = "mvvm_prefix";

function getMvvm() {
	const tComponent: Component = new TestComponent();
	const mvvm: Mvvm = new MvvmImpl(mvvmId, tComponent, tComponent[MODULE_FIELD_NAME], mvvmPrefix, new ScopeImpl(), () => { });
	return mvvm;
}

describe("Mvvm tests", () => {

	it("Mvvm new instance", () => {
		const mvvm: Mvvm = getMvvm();
		assert.isNotNull(mvvm);
	});

	it("nestingChanged()", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		mvvm.nestingChanged();
		verify(spyMvvm.nestingChanged()).once();
	});

	it("dispose()", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		mvvm.dispose();
		verify(spyMvvm.dispose()).once();
	});

	xit("digest()", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		mvvm.digest();
		verify(spyMvvm.digest()).once();
	});

	xit("mediate<T>(expression: string): ModelMediator<T>", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		// do the actual work here
	});

	xit("requestMediators(consumer: DigestionCandidateConsumer): void", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		// do the actual work here
	});

	xit("requestMediatorSources(sources: MediatorSource[]): void", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		// do the actual work here
	});

	xit("getParent(): ComponentInternals", () => {
		const tComponent: Component = new TestComponent();
		const mvvm: Mvvm = new MvvmImpl(mvvmId, tComponent, tComponent[MODULE_FIELD_NAME], mvvmPrefix, new ScopeImpl(), () => { });
		assert.isNull(mvvm.getParent());
	});

	xit("$apply(fn: Function, args: any[]): any", () => {
		const tComponent: Component = new TestComponent();
		const mvvm: Mvvm = new MvvmImpl(mvvmId, tComponent, tComponent[MODULE_FIELD_NAME], mvvmPrefix, new ScopeImpl(), () => { });
		assert.isNull(mvvm.getParent());
	});

	xit("$apply() - null fn", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		// do the actual work here
	});

	xit("$apply() - null args", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		// do the actual work here
	});

	it("getModelFn(): () => any", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		mvvm.getModelFn();
		verify(spyMvvm.getModelFn()).once();
	});

	it("getItemFn(): () => any", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		mvvm.getItemFn();
		verify(spyMvvm.getItemFn()).once();
	});

	it("getExternalFn(): () => any", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		mvvm.getExternalFn();
		verify(spyMvvm.getExternalFn()).once();
	});

	it("skipId(id: string): () => any", () => {
		const mvvm: Mvvm = getMvvm();
		const spyMvvm: Mvvm = spy(mvvm);
		mvvm.skipId("myid");
		verify(spyMvvm.skipId("myid")).once();
	});

});
