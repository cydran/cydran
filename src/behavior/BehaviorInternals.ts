import Disposable from "interface/ables/Disposable";
import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import Mediator from "mediator/Mediator";
import OnContinuation from "message/OnContinuation";
import Logger from "log/Logger";
import Module from "module/Module";
import AttributeExtractor from 'component/AttributeExtractor';

interface BehaviorInternals<M, E extends HTMLElement | Text, P> extends Disposable, Tellable {

	getLogger(): Logger;

	initialize(dependencies: BehaviorDependencies): void;

	validate(): void;

	populate(): void;

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

	getExtractor(): AttributeExtractor;

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

	setFlag(name: string): void;

	isFlagged(name: string): boolean;

}

export default BehaviorInternals;
