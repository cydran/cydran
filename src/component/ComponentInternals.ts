import Logger from "@/logger/Logger";
import Scope from "@/model/Scope";
import Digestable from "@/mvvm/Digestable";
import ComponentFlags from "@/component/ComponentFlags";
import Module from "@/module/Module";
import Nestable from "@/component/Nestable";

interface ComponentInternals extends Digestable {

	init(): void;

	hasMetadata(name: string): boolean;

	getMetadata(name: string): any;

	hasRegion(name: string): boolean;

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

	watch(expression: string, target: (previous: any, current: any) => void): void;

	on(target: (payload: any) => void, messageName: string, channel?: string): void;

	getLogger(): Logger;

	getModule(): Module;

	getParent(): Nestable;

	setData(data: any): void;

	getData(): any;

	importExternals(): void;

	exportExternals(): void;

	hasExternalMediators(): boolean;

	getExternalCache(): any;

	getFlags(): ComponentFlags;

	getId(): string;

}

export default ComponentInternals;
