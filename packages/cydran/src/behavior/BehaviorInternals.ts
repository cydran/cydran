import Tellable from "interface/ables/Tellable";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Mediator from "mediator/Mediator";
import Logger from "log/Logger";
import Attributes from 'component/Attributes';
import FieldValidations from "validator/FieldValidations";
import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import SimpleMap from "interface/SimpleMap";
import OnContinuation from "continuation/OnContinuation";
import Sendable from "interface/ables/Sendable";
import { Context, Nestable } from "context/Context";
import Receivable from "interface/ables/Receivable";

interface BehaviorInternals<M, E extends HTMLElement | Text, P> extends Tellable, Sendable, Receivable {

	getLogger(): Logger;

	setLoggerName(name: string): void;

	initialize(dependencies: BehaviorDependencies): void;

	mount(): void;

	unmount(): void;

	digest(): void;

	getId(): string;

	getParentId(): string;

	getObject<U>(id: string, instanceArguments?: unknown[]): U;

	getContext(): Context;

	on(messageName: string): OnContinuation;

	bridge(name: string): void;

	isMounted(): boolean;

	getEl(): E;

	getParams(): P;

	getBehaviorPrefix(): string;

	getExpression(): string;

	getExtractor(): Attributes;

	getPrefix(): string;

	getModelFn(): () => unknown;

	getValueFn(): () => unknown;

	mediate<T>(expression: string, reducerFn?: (input: unknown) => T): Mediator<T>;

	notify(name: string, detail: unknown): void;

	notifyElement(name: string, detail: unknown, element: HTMLElement): void;

	getModel(): unknown;

	getTargetComponent(): Nestable;

	getMediator(): Mediator<M>;

	sync(fn?: (...syncArguments: unknown[]) => void, args?: unknown[]): void;

	invoke(params?: unknown): void;

	isMutable(): boolean;

	isValidated(): boolean;

	setFlag(name: string): void;

	isFlagged(name: string): boolean;

	setDefaults(defaults: P): void;

	setValuelessDefaults(valuelessDefaults: SimpleMap<string>): void;

	setDefaultExpression(defaultExpression: string): void;

	setValidations(validations: FieldValidations<HTMLElement>): void;

	setConverters(converters: BehaviorAttributeConverters): void;

	setPrefixed(prefixed: boolean): void;

	setReducerFn(reducerFn: (input: unknown) => M): void;

}

export default BehaviorInternals;
