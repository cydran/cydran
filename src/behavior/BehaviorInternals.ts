import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Mediator from "mediator/Mediator";
import OnContinuation from "message/OnContinuation";
import Logger from "log/Logger";
import Module from "module/Module";
import Attributes from 'component/Attributes';
import FieldValidations from "validator/FieldValidations";
import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";
import Dom from "dom/Dom";
import SimpleMap from "interface/SimpleMap";

interface BehaviorInternals<M, E extends HTMLElement | Text, P> extends Tellable {

	getLogger(): Logger;

	setLoggerName(name: string): void;

	initialize(dependencies: BehaviorDependencies): void;

	mount(): void;

	unmount(): void;

	digest(): void;

	message(channelName: string, messageName: string, payload?: any): void;

	getId(): string;

	getParentId(): string;

	get<U>(id: string): U;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	bridge(name: string): void;

	isMounted(): boolean;

	getEl(): E;

	getParams(): P;

	getBehaviorPrefix(): string;

	getExpression(): string;

	getExtractor(): Attributes;

	getPrefix(): string;

	getModelFn(): () => any;

	getValueFn(): () => any;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T>;

	notify(name: string, detail: any): void;

	notifyElement(name: string, detail: any, element: HTMLElement): void;

	getModule(): Module;

	getModel(): any;

	getParent(): Nestable;

	getMediator(): Mediator<M>;

	$apply(fn: Function, args: any[]): any;

	invoke(params?: any): void;

	isMutable(): boolean;

	isValidated(): boolean;

	setFlag(name: string): void;

	isFlagged(name: string): boolean;

	setDefaults(defaults: P): void;

	setValuelessDefaults(valuelessDefaults: SimpleMap<string>): void;

	setDefaultExpression(defaultExpression: string): void;

	setValidations(validations: FieldValidations<HTMLElement>): void;

	setConverters(converters: BehaviorAttributeConverters): void;

	setReducerFn(reducerFn: (input: any) => M): void;

	getDom(): Dom;

}

export default BehaviorInternals;
