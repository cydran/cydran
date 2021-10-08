import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Mediator from "mediator/Mediator";
import OnContinuation from "message/OnContinuation";
import Logger from "log/Logger";
import Module from "module/Module";
import Attributes from 'component/Attributes';
import BehaviorAttributeValidations from "behavior/BehaviorAttributeValidations";
import BehaviorAttributeConverters from "behavior/BehaviorAttributeConverters";

interface BehaviorInternals<M, E extends HTMLElement | Text, P> extends Disposable, Tellable {

	getLogger(): Logger;

	setLoggerName(name: string): void;

	initialize(dependencies: BehaviorDependencies): void;

	mount(): void;

	unmount(): void;

	digest(): void;

	message(channelName: string, messageName: string, payload?: any): void;

	$dispose(): void;

	getId(): string;

	getParentId(): string;

	get<U>(id: string): U;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	bridge(name: string): void;

	getEl(): E;

	getParams(): P;

	getBehaviorPrefix(): string;

	getExpression(): string;

	getExtractor(): Attributes;

	getPrefix(): string;

	getModelFn(): () => any;

	getValueFn(): () => any;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T>;

	getModule(): Module;

	getModel(): any;

	getParent(): Nestable;

	getMediator(): Mediator<M>;

	$apply(fn: Function, args: any[]): any;

	isMutable(): boolean;

	isValidated(): boolean;

	setFlag(name: string): void;

	isFlagged(name: string): boolean;

	setDefaults(defaults: P): void;

	setValidations(validations: BehaviorAttributeValidations<HTMLElement>): void;

	setConverters(converters: BehaviorAttributeConverters): void;

	setReducerFn(reducerFn: (input: any) => M): void;

}

export default BehaviorInternals;
