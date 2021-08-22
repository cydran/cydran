import BehaviorSource from "behavior/BehaviorSource";
import Mediator from "mediator/Mediator";
import Scope from "scope/Scope";
import Module from "module/Module";
import Messagable from "interface/ables/Messagable";
import AttributeExtractor from "component/AttributeExtractor";
import Region from "component/Region";
import Digestable from "interface/ables/Digestable";
import Nestable from "interface/ables/Nestable";
import Logger from "log/Logger";
import ElementOperations from "component/ElementOperations";
import Tellable from "interface/ables/Tellable";

interface ComponentInternals extends Digestable, Tellable, BehaviorSource {

	$apply(fn: Function, args: any[]): any;

	$dispose(): void;

	addBehavior(behavior: any): void;

	addNamedElement(name: string, element: HTMLElement): void;

	addPropagatingBehavior(behavior: any): void;

	addRegion(name: string, element: HTMLElement, locked: boolean): Region;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	createRegionName(): string;

	digest(): void;

	evaluate<T>(expression: string): T;

	forElement<E extends HTMLElement>(name: string): ElementOperations<E>;

	get<T>(id: string): T;

	getChild<N extends Nestable>(name: string): N;

	getComponent(): Nestable;

	getData(): any;

	getEl(): HTMLElement;

	getExtractor(): AttributeExtractor;

	getId(): string;

	getItemFn(): () => any;

	getLogger(): Logger;

	getMessagables(): Messagable[];

	getMetadata(name: string): any;

	getModel(): any;

	getModelFn(): () => any;

	getModule(): Module;

	getNamedElement<E extends HTMLElement>(name: string): E;

	getParent(): Nestable;

	getPrefix(): string;

	getScope(): Scope;

	getWatchContext(): any;

	hasMetadata(name: string): boolean;

	hasRegion(name: string): boolean;

	init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => Region): void;

	isConnected(): boolean;

	isMounted(): boolean;

	isRepeatable(): boolean;

	isValidated(): boolean;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T>;

	message(channelName: string, messageName: string, payload: any): void;

	on(target: (payload: any) => void, messageName: string, channel?: string): void;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void;

	setItemFn(itemFn: () => any): void;

	skipId(id: string): void;

	watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void;

}

export default ComponentInternals;
