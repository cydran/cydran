import DigestableSource from "behavior/DigestableSource";
import Mediator from "mediator/Mediator";
import Scope from "scope/Scope";
import Messagable from "interface/ables/Messagable";
import Attributes from "component/Attributes";
import Region from "component/Region";
import Digestable from "interface/ables/Digestable";
import Logger from "log/Logger";
import ElementOperations from "component/ElementOperations";
import Tellable from "interface/ables/Tellable";
import FormOperations from "component/FormOperations";
import { FilterBuilder } from "filter/Filter";
import Watchable from "interface/ables/Watchable";
import { ActionContinuation, Nestable } from "interface/ComponentInterfaces";
import Actionable from "interface/ables/Actionable";
import Sendable from "interface/ables/Sendable";
import { Context } from "context/Context";

interface ComponentInternals extends Digestable, Tellable, DigestableSource, Actionable<ActionContinuation>, Sendable {

	sync(): any;

	addBehavior(behavior: any): void;

	addNamedElement(name: string, element: HTMLElement): void;

	addForm(form: HTMLFormElement): void;

	addRegion(name: string, region: Region): Region;

	createRegionName(): string;

	digest(): void;

	evaluate<T>(expression: string): T;

	forElement<E extends HTMLElement>(name: string): ElementOperations<E>;

	forForm(name: string): FormOperations;

	forForms(): FormOperations;

	getObject<T>(id: string): T;

	getChild<N extends Nestable>(name: string): N;

	getComponent(): Nestable;

	getData(): any;

	getEl(): HTMLElement;

	getName(): string;

	getExtractor(): Attributes;

	getId(): string;

	getItemFn(): () => any;

	getLogger(): Logger;

	getStyles(): string;

	getMessagables(): Actionable<Messagable>[];

	getMetadata(name: string): any;

	getModel(): any;

	getModelFn(): () => any;

	setContext(context: Context): void;

	getContext(): Context;

	getNamedElement<E extends HTMLElement>(name: string): E;

	getParent(): Nestable;

	getPrefix(): string;

	getScope(): Scope;

	getWatchScope(): any;

	hasMetadata(name: string): boolean;

	hasRegion(name: string): boolean;

	init(): void;

	isConnected(): boolean;

	isMounted(): boolean;

	isValidated(): boolean;

	invoke(expression: string, params?: any): void;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): Mediator<T>;

	message(channelName: string, messageName: string, payload: any): void;

	on(callback: (payload: any) => void, messageName: string, channel?: string): void;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentId: string, defaultComponentName?: string): void;

	setItemFn(itemFn: () => any): void;

	watch<T>(expression: string, callback: (previous: T, current: T) => void, reducerFn?: (input: any) => T, targetThis?: any): void;

	withFilter(watchable: Watchable, expr: string): FilterBuilder;

	addInterval(callback: () => void, delay?: number): void;

	postConstruct(): void;

	$c(): ActionContinuation;

}

export default ComponentInternals;
