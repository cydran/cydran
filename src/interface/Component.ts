import { 
	Scope,
	Mvvm
} from "interface/General";

import { Logger } from "interface/Logger";
import { Digestable, Nestable } from "interface/Ables";
import { Module } from "interface/Module";
import { NamedElementOperations } from "interface/Element";
import { SimpleMap } from "interface/Register";

interface Renderer {
	render(): HTMLElement;
}

interface ComponentFactory {
	create(item?: any): Nestable;
}
interface ComponentIdPair {

	componentId: string;

	moduleId: string;

}
interface ComponentOptions {
	metadata?: SimpleMap<any>;

	prefix?: string;
}

interface InternalComponentOptions extends ComponentOptions {
	repeatable?: boolean;

	itemFn?: () => any;

	parentModelFn?: () => any;

	module?: Module;

	alwaysConnected?: boolean;

	parent?: Nestable;

	skipId?: string;
}

interface ComponentInternals extends Digestable, Mvvm {
	init(): void;

	hasMetadata(name: string): boolean;

	getMetadata(name: string): any;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(
		name: string,
		componentId: string,
		defaultComponentName?: string
	): void;

	message(channelName: string, messageName: string, payload: any): void;

	tell(name: string, payload: any): void;

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

	watch<T>(
		expression: string,
		target: (previous: T, current: T) => void,
		reducerFn?: (input: any) => T,
		context?: any
	): void;

	on(target: (payload: any) => void, messageName: string, channel?: string): void;

	forElement<E extends HTMLElement>(name: string): NamedElementOperations<E>;

	getLogger(): Logger;

	getModule(): Module;

	getParent(): Nestable;

	evaluate<T>(expression: string): T;

	setItemFn(itemFn: () => any): void;

	getData(): any;

	getId(): string;

	getWatchContext(): any;
}

interface MetadataContinuation {
	has: (name: string) => boolean;

	get: (name: string) => any;
}

export {
	ComponentInternals,
	ComponentFactory,
	ComponentIdPair,
	ComponentOptions,
	InternalComponentOptions,
	MetadataContinuation,
	Renderer
};
