import Disposable from "@/interface/ables/Disposable";
import Nestable from "@/interface/ables/Nestable";
import Tellable from "@/interface/ables/Tellable";
import ElementMediatorDependencies from "@/mediator/ElementMediatorDependencies";
import ModelMediator from "@/mediator/ModelMediator";
import OnContinuation from "@/message/OnContinuation";

interface ElementMediatorInternals<M, E extends HTMLElement | Text, P> extends Disposable, Tellable {

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

	get<U>(id: string): U;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	on(messageName: string): OnContinuation;

	bridge(name: string): void;

	getEl(): E;

	getParams(): P;

	getMediatorPrefix(): string;

	getExpression(): string;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	getModel(): any;

	getParent(): Nestable;

	getModelMediator(): ModelMediator<M>;

	$apply(fn: Function, args: any[]): any;

	isMutable(): boolean;

}

export default ElementMediatorInternals;