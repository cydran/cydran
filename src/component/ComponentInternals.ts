import DigestableSource from "behavior/DigestableSource";
import Mediator from "mediator/Mediator";
import Scope from "scope/Scope";
import Module from "module/Module";
import Messagable from "interface/ables/Messagable";
import Attributes from "component/Attributes";
import Region from "component/Region";
import Digestable from "interface/ables/Digestable";
import Nestable from "interface/ables/Nestable";
import Logger from "log/Logger";
import ElementOperations from "component/ElementOperations";
import Tellable from "interface/ables/Tellable";

interface ComponentInternals extends Digestable, Tellable, DigestableSource {

	$apply(fn: Function, args: any[]): any;

	addBehavior(behavior: any): void;

	addNamedElement(name: string, element: HTMLElement): void;

	addRegion(name: string, region: Region): Region;

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

	getName(): string;

	getExtractor(): Attributes;

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

	init(): void;

	isConnected(): boolean;

	isMounted(): boolean;

	isValidated(): boolean;

	invoke(expression: string, params?: any): void;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T>;

	message(channelName: string, messageName: string, payload: any): void;

	on(target: (payload: any) => void, messageName: string, channel?: string): void;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void;

	setItemFn(itemFn: () => any): void;

	watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void;

}

export default ComponentInternals;
