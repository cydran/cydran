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

interface ComponentInternals extends Digestable, Mvvm, Tellable {

	init(): void;

	hasMetadata(name: string): boolean;

	getMetadata(name: string): any;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void;

	message(channelName: string, messageName: string, payload: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	$dispose(): void;

	getEl(): HTMLElement;

	getComponent(): Nestable;

	get<T>(id: string): T;

	getPrefix(): string;

	isMounted(): boolean;

	isConnected(): boolean;

	isRepeatable(): boolean;

	getScope(): Scope;

	watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void;

	on(target: (payload: any) => void, messageName: string, channel?: string): void;

	forElement<E extends HTMLElement>(name: string): ElementOperations<E>;

	getLogger(): Logger;

	getModule(): Module;

	getParent(): Nestable;

	evaluate<T>(expression: string): T;

	setItemFn(itemFn: () => any): void;

	getData(): any;

	getId(): string;

	getWatchContext(): any;
}

interface Mvvm extends BehaviorSource {

	init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => Region): void;

	$dispose(): void;

	getId(): string;

	getNamedElement<E extends HTMLElement>(name: string): E;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T>;

	digest(): void;

	$apply(fn: Function, args: any[]): any;

	getModelFn(): () => any;

	getItemFn(): () => any;

	getScope(): Scope;

	skipId(id: string): void;

	getMessagables(): Messagable[];

	getModule(): Module;

	getModel(): any;

	createRegionName(): string;

	addRegion(name: string, element: HTMLElement, locked: boolean): Region;

	addNamedElement(name: string, element: HTMLElement): void;

	addBehavior(behavior: any): void;

	addPropagatingBehavior(behavior: any): void;

	getExtractor(): AttributeExtractor;

	isValidated(): boolean;

}

export { ComponentInternals, Mvvm };
