import Logger from "@/logger/Logger";
import Scope from "@/model/Scope";
import Digestable from "@/mvvm/Digestable";
import ComponentFlags from "@/component/ComponentFlags";
import Module from "@/module/Module";
import Nestable from "@/component/Nestable";
import NamedElementOperations from "@/component/NamedElementOperations";

interface ComponentInternals extends Digestable {

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

	dispose(): void;

	getEl(): HTMLElement;

	getComponent(): Nestable;

	get<T>(id: string): T;

	getPrefix(): string;

	isConnected(): boolean;

	getScope(): Scope;

	watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void;

	on(target: (payload: any) => void, messageName: string, channel?: string): void;

	forElement<E extends HTMLElement>(name: string): NamedElementOperations<E>;

	getLogger(): Logger;

	getModule(): Module;

	getParent(): Nestable;

	evaluate<T>(expression: string): T;

	setItemFn(itemFn: () => any): void;

	getData(): any;

	getFlags(): ComponentFlags;

	getId(): string;

	getWatchContext(): any;

}

export default ComponentInternals;
