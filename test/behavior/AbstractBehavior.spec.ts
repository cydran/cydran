import { assertNoErrorThrown, assertNullGuarded } from "test/TestUtils";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import DigestionCandidateConsumer from 'digest/DigestionCandidateConsumer';
import DigestionCandidate from 'digest/DigestionCandidate';
import AbstractBehavior from 'behavior/AbstractBehavior';
import { asIdentity } from 'util/AsFunctions';
import Mediator from 'mediator/Mediator';
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import ModulesContextImpl from 'module/ModulesContextImpl';
import Behavior from 'behavior/Behavior';
import Validators from 'validator/Validators';
import BehaviorTransitions from 'behavior/BehaviorTransitions';

class TestDigestionCandidateConsumer implements DigestionCandidateConsumer {

	public add(key: string, mediators: DigestionCandidate[]): void {
		// do nothing
	}

}

class TestBehavior extends AbstractBehavior<any, any, any> {

	constructor() {
		super(asIdentity);
	}

	public bridgeProxy(name: string): void {
		this.bridge(name);
	}

	public mediateProxy<T>(expression: string): Mediator<T> {
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

const dependencies: BehaviorDependencies = {
	el: document.body,
	expression: "true",
	model: null,
	parent: null,
	prefix: "prefix",
	behaviorPrefix: "behaviorPrefix",
	module: new ModulesContextImpl().getDefaultModule(),
	validated: false,
	mutable: true
};

function createBehavior(): Behavior<any, any, any> {
	const specimen: Behavior<any, any, any> = new TestBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);

	return specimen;
}

test("get() - null id", () => {
	assertNullGuarded("id", () => createBehavior().get(null));
});

test("get() - invalid id", () => {
	assertNullGuarded("id must be valid", () => createBehavior().get("Invalid id!"), "ValidationError");
});

test("message() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => createBehavior().message(null, MESSAGE_NAME, PAYLOAD));
});

test("message() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => createBehavior().message(CHANNEL_NAME, null, PAYLOAD));
});

test("message() - null payload", () => {
	assertNoErrorThrown(() => createBehavior().message(CHANNEL_NAME, MESSAGE_NAME, null));
});

test("broadcast() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => createBehavior().broadcast(null, MESSAGE_NAME, PAYLOAD));
});

test("broadcast() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => createBehavior().broadcast(CHANNEL_NAME, null, PAYLOAD));
});

test("getId()", () => {
	const specimen: Behavior<any, any, any> = new TestBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);
	expect(specimen.getId()).not.toBeNull();
	expect(typeof specimen.getId()).toEqual("string");
});

test("on() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => createBehavior().on(null));
});

test("on().forChannel() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => createBehavior().on(MESSAGE_NAME).forChannel(null));
});

test("on().forChannel().invoke() - null target", () => {
	assertNullGuarded("target", () => createBehavior().on(MESSAGE_NAME).forChannel(CHANNEL_NAME).invoke(null));
});

test("on().invoke() - null target", () => {
	assertNullGuarded("target", () => createBehavior().on(MESSAGE_NAME).invoke(null));
});

test("bridge() - null name", () => {
	assertNullGuarded("name", () => createBehavior().bridgeProxy(null));
});

test("mediate() - null expression", () => {
	assertNullGuarded("expression", () => createBehavior().mediateProxy(null));
});

test("$apply() - null fn", () => {
	assertNullGuarded("fn", () => createBehavior().$applyProxy(null, []));
});

test("$apply() - null args", () => {
	assertNullGuarded("args", () => createBehavior().$applyProxy(() => {
		// Intentionally do nothing
	}, null));
});
