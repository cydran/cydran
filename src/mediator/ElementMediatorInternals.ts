import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import ElementMediatorDependencies from "mediator/ElementMediatorDependencies";
import ModelMediator from "mediator/ModelMediator";
import OnContinuation from "message/OnContinuation";
import Logger from "log/Logger";
import Module from "module/Module";
import AttributeExtractor from 'element/AttributeExtractor';

interface ElementMediatorInternals<M, E extends HTMLElement | Text, P> extends Disposable, Tellable {

	getLogger(): Logger;

	initialize(dependencies: ElementMediatorDependencies): void;

	validate(): void;

	populate(): void;

	mount(): void;

	unmount(): void;

	digest(): void;

	message(channelName: string, messageName: string, payload?: any): void;

	is(name: string): boolean;

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

	getMediatorPrefix(): string;

	getExpression(): string;

	getExtractor(): AttributeExtractor;

	getPrefix(): string;

	getModelFn(): () => any;

	getValueFn(): () => any;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	getModule(): Module;

	getModel(): any;

	getParent(): Nestable;

	getModelMediator(): ModelMediator<M>;

	$apply(fn: Function, args: any[]): any;

	isMutable(): boolean;

	setFlag(name: string): void;

	isFlagged(name: string): boolean;

}

export default ElementMediatorInternals;