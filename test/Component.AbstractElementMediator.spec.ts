import { assertNoErrorThrown, assertNullGuarded } from "./TestUtils";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import DigestionCandidateConsumer from 'digest/DigestionCandidateConsumer';
import DigestionCandidate from 'digest/DigestionCandidate';
import AbstractElementMediator from 'mediator/AbstractElementMediator';
import { asIdentity } from 'util/AsFunctions';
import ModelMediator from 'mediator/ModelMediator';
import ElementMediatorDependencies from 'mediator/ElementMediatorDependencies';
import ModulesContextImpl from 'module/ModulesContextImpl';
import ElementMediator from 'mediator/ElementMediator';
import Validators from 'validator/Validators';

class TestDigestionCandidateConsumer implements DigestionCandidateConsumer {

	public add(key: string, mediators: DigestionCandidate[]): void {
		// do nothing
	}

}

class TestElementMediator extends AbstractElementMediator<any, any, any> {

	constructor(deps: any) {
		super(deps, false, asIdentity);
	}

	public bridgeProxy(name: string): void {
		this.bridge(name);
	}

	public mediateProxy<T>(expression: string): ModelMediator<T> {
		return this.mediate(expression);
	}

	public $applyProxy(fn: Function, args: any[]): any {
		this.$apply(fn, args);
	}

	protected wire(): void {
		// Intentionally do nothing
	}

	protected unwire(): void {
		// Intentionally do nothing
	}

	protected validate(element: HTMLInputElement, check: (name: string, value?: any) => Validators): void {
		// Intentionally do nothing
	}

}

const CHANNEL_NAME: string = "channelName";
const MESSAGE_NAME: string = "messageName";
const PAYLOAD: string = "payload";

const dependencies: ElementMediatorDependencies = {
	el: null,
	expression: "true",
	model: null,
	parent: null,
	prefix: "prefix",
	mediatorPrefix: "mediatorPrefix",
	module: new ModulesContextImpl().getDefaultModule(),
	validated: false,
	mutable: true
};

test("Constructor - null dependencies", () => {
	assertNullGuarded("dependencies", () => new TestElementMediator(null));
});

test("get() - null id", () => {
	assertNullGuarded("id", () => new TestElementMediator(dependencies).get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => new TestElementMediator(dependencies).get("Invalid id!"), "ValidationError");
});

test("message() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => new TestElementMediator(dependencies).message(null, MESSAGE_NAME, PAYLOAD));
});

test("message() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => new TestElementMediator(dependencies).message(CHANNEL_NAME, null, PAYLOAD));
});

test("message() - null payload", () => {
	assertNoErrorThrown(() => new TestElementMediator(dependencies).message(CHANNEL_NAME, MESSAGE_NAME, null));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => new TestElementMediator(dependencies).broadcast(null, MESSAGE_NAME, PAYLOAD));
});

test("broadcast() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => new TestElementMediator(dependencies).broadcast(CHANNEL_NAME, null, PAYLOAD));
});

test("dispose()", () => {
	const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
	const spySpecimen: ElementMediator<any, any, any> = spy(specimen);
	specimen.$dispose();
	verify(spySpecimen.$dispose()).once();
});

test("getId()", () => {
	const specimen: ElementMediator<any, any, any> = new TestElementMediator(dependencies);
	expect(specimen.getId()).not.toBeNull();
	expect(typeof specimen.getId()).toEqual("string");
});

test("on() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => new TestElementMediator(dependencies).on(null));
});

test("on().forChannel() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => new TestElementMediator(dependencies).on(MESSAGE_NAME).forChannel(null));
});

test("on().forChannel().invoke() - null target", () => {
	assertNullGuarded("target", () => new TestElementMediator(dependencies).on(MESSAGE_NAME).forChannel(CHANNEL_NAME).invoke(null));
});

test("on().invoke() - null target", () => {
	assertNullGuarded("target", () => new TestElementMediator(dependencies).on(MESSAGE_NAME).invoke(null));
});

test("bridge() - null name", () => {
	assertNullGuarded("name", () => new TestElementMediator(dependencies).bridgeProxy(null));
});

test("mediate() - null expression", () => {
	assertNullGuarded("expression", () => new TestElementMediator(dependencies).mediateProxy(null));
});

test("$apply() - null fn", () => {
	assertNullGuarded("fn", () => new TestElementMediator(dependencies).$applyProxy(null, []));
});

test("$apply() - null args", () => {
	assertNullGuarded("args", () => new TestElementMediator(dependencies).$applyProxy(() => {
		// Intentionally do nothing
	}, null));
});
