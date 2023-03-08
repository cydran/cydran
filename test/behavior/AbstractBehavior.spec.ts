import { assertNoErrorThrown, assertNullGuarded } from "test/TestUtils";
import DigestionCandidateConsumer from 'digest/DigestionCandidateConsumer';
import DigestionCandidate from 'digest/DigestionCandidate';
import AbstractBehavior from 'behavior/AbstractBehavior';
import { asIdentity } from 'util/AsFunctions';
import Mediator from 'mediator/Mediator';
import BehaviorDependencies from 'behavior/BehaviorDependencies';
import Behavior from 'behavior/Behavior';
import Validators from 'validator/Validators';
import BehaviorTransitions from 'behavior/BehaviorTransitions';
import JSType from "const/JSType";
import PropertiesImpl from 'properties/PropertiesImpl';

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

	public syncProxy(): any {
		this.sync();
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
	validated: false,
	mutable: true
};

function createBehavior(): Behavior<any, any, any> {
	const specimen: Behavior<any, any, any> = new TestBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);

	return specimen;
}

test("getObject() - null id", () => {
	assertNullGuarded("id", () => createBehavior().getObject(null));
});

test("getObject() - invalid id", () => {
	assertNullGuarded("id must be valid", () => createBehavior().getObject("Invalid id!"), "ValidationError");
});

test("message - self() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => createBehavior().send(MESSAGE_NAME, PAYLOAD).onChannel(null).toSelf());
});

test("message - self() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => createBehavior().send(null, PAYLOAD).onChannel(CHANNEL_NAME).toSelf());
});

test("message - self() - null payload", () => {
	assertNoErrorThrown(() => createBehavior().send(MESSAGE_NAME, null).onChannel(CHANNEL_NAME).toSelf());
});

test("message - context() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => createBehavior().send(MESSAGE_NAME, PAYLOAD).onChannel(null).toContext());
});

test("message - context() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => createBehavior().send(null, PAYLOAD).onChannel(CHANNEL_NAME).toContext());
});

test("getId()", () => {
	const specimen: Behavior<any, any, any> = new TestBehavior();
	specimen.tell(BehaviorTransitions.INIT, dependencies);
	expect(specimen.getId()).not.toBeNull();
	expect(typeof specimen.getId()).toEqual(JSType.STR);
});

test("on() - null messageName", () => {
	assertNullGuarded(MESSAGE_NAME, () => createBehavior().on(null));
});

test("on().forChannel() - null channelName", () => {
	assertNullGuarded(CHANNEL_NAME, () => createBehavior().on(MESSAGE_NAME).forChannel(null));
});

test("on().forChannel().invoke() - null callback", () => {
	assertNullGuarded("callback", () => createBehavior().on(MESSAGE_NAME).forChannel(CHANNEL_NAME).invoke(null));
});

test("on().invoke() - null callback", () => {
	assertNullGuarded("callback", () => createBehavior().on(MESSAGE_NAME).invoke(null));
});

test("bridge() - null name", () => {
	assertNullGuarded("name", () => createBehavior().bridgeProxy(null));
});

test("mediate() - null expression", () => {
	assertNullGuarded("expression", () => createBehavior().mediateProxy(null));
});

test("sync() - null fn", () => {
	// TODO - Implement
});

test("sync() - null args", () => {
	// TODO - Implement
});
