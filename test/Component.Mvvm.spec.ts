import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { MODULE_FIELD_NAME } from "@/Constants";
import { Mvvm } from '@/Interfaces';
import { Component, ScopeImpl, ModulesContextImpl, MvvmImpl } from '@/Component';

class TestComponent extends Component {
	constructor() {
		super("<div></div>");
	}

	public init(): void { /* void */ }
}

ModulesContextImpl.resetInstances();
new ModulesContextImpl().getDefaultModule().associate(TestComponent);

const mvvmId: string = "test_id_01";
const mvvmPrefix: string = "mvvm_prefix";

function getMvvm() {
	const tComponent: Component = new TestComponent();
	const mvvm: Mvvm = new MvvmImpl(mvvmId, tComponent, tComponent[MODULE_FIELD_NAME], mvvmPrefix, new ScopeImpl(), () => {/**/ });
	return mvvm;
}

test("Mvvm new instance", () => {
	const mvvm: Mvvm = getMvvm();
	expect(mvvm).not.toBeNull();
});

test("nestingChanged()", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	mvvm.nestingChanged();
	verify(spyMvvm.nestingChanged()).once();
});

test("dispose()", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	mvvm.$dispose();
	verify(spyMvvm.$dispose()).once();
});

test.skip("digest()", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	mvvm.digest();
	verify(spyMvvm.digest()).once();
});

test.skip("mediate<T>(expression: string): ModelMediator<T>", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	// do the actual work here
});

test.skip("requestMediators(consumer: DigestionCandidateConsumer): void", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	// do the actual work here
});

test.skip("requestMediatorSources(sources: MediatorSource[]): void", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	// do the actual work here
});

test.skip("getParent(): ComponentInternals", () => {
	const tComponent: Component = new TestComponent();
	const mvvm: Mvvm = new MvvmImpl(mvvmId, tComponent, tComponent[MODULE_FIELD_NAME], mvvmPrefix, new ScopeImpl(), () => {/**/ });
	expect(mvvm.getParent()).toBeNull();
});

test.skip("$apply(fn: Function, args: any[]): any", () => {
	const tComponent: Component = new TestComponent();
	const mvvm: Mvvm = new MvvmImpl(mvvmId, tComponent, tComponent[MODULE_FIELD_NAME], mvvmPrefix, new ScopeImpl(), () => {/**/ });
	expect(mvvm.getParent()).toBeNull();
});

test.skip("$apply() - null fn", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	// do the actual work here
});

test.skip("$apply() - null args", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	// do the actual work here
});

test("getModelFn(): () => any", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	mvvm.getModelFn();
	verify(spyMvvm.getModelFn()).once();
});

test("getItemFn(): () => any", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	mvvm.getItemFn();
	verify(spyMvvm.getItemFn()).once();
});

test("skipId(id: string): () => any", () => {
	const mvvm: Mvvm = getMvvm();
	const spyMvvm: Mvvm = spy(mvvm);
	mvvm.skipId("myid");
	verify(spyMvvm.skipId("myid")).once();
});
