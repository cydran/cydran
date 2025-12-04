import DigestableSource from "behavior/DigestableSource";
import Mediator from "mediator/Mediator";
import Scope from "scope/Scope";
import Attributes from "component/Attributes";
import Region from "component/Region";
import Digestable from "interface/ables/Digestable";
import Logger from "log/Logger";
import ElementOperations from "component/ElementOperations";
import Tellable from "interface/ables/Tellable";
import FormOperations from "component/FormOperations";
import { FilterBuilder } from "filter/Filter";
import Watchable from "interface/ables/Watchable";
import Actionable from "interface/ables/Actionable";
import Sendable from "interface/ables/Sendable";
import { ActionContinuation, Context, Nestable, SeriesOperations } from "context/Context";
import Receivable from "interface/ables/Receivable";
import Series from "component/Series";
import { CallBackThisObject } from 'CydranTypes';

interface ComponentInternals extends Digestable, Tellable, DigestableSource, Actionable<ActionContinuation>, Sendable, Receivable {

	sync(): unknown;

	addBehavior(behavior: unknown): void;

	addNamedElement(name: string, element: HTMLElement): void;

	addForm(form: HTMLFormElement): void;

	addRegion(name: string, region: Region): Region;

	addSeries(name: string, series: Series): Series;

	createRegionName(): string;

	digest(): void;

	evaluate<T>(expression: string): T;

	forElement<E extends HTMLElement>(name: string): ElementOperations<E>;

	forSeries(name: string): SeriesOperations;

	forForm(name: string): FormOperations;

	forForms(): FormOperations;

	getObject<T>(id: string, instanceArguments: unknown[]): T;

	getChild<N extends Nestable>(name: string): N;

	getComponent(): Nestable;

	getData(): unknown;

	getEl(): HTMLElement;

	getName(): string;

	getExtractor(): Attributes;

	getId(): string;

	getItemFn(): () => unknown;

	getLogger(): Logger;

	getStyles(): string;

	getMetadata(name: string): unknown;

	getModel(): unknown;

	getModelFn(): () => unknown;

	setContext(context: Context): void;

	getContext(): Context;

	getNamedElement<E extends HTMLElement>(name: string): E;

	getParent(): Nestable;

	getPrefix(): string;

	getScope(): Scope;

	getWatchScope(): unknown;

	hasMetadata(name: string): boolean;

	hasRegion(name: string): boolean;

	init(): void;

	isConnected(): boolean;

	isMounted(): boolean;

	isValidated(): boolean;

	invoke(expression: string, params?: unknown): void;

	mediate<T>(expression: string, reducerFn?: (input: unknown) => T): Mediator<T>;

	message(channelName: string, messageName: string, payload: unknown): void;

	on(callback: (payload: unknown) => void, messageName: string, channel?: string): void;

	setChild(name: string, component: Nestable): void;

	setByObjectId(name: string, componentId: string, defaultComponentName?: string): void;

	setItemFn(itemFn: () => unknown): void;

	watch<T>(expression: string, callback: (previous: T, current: T) => void, reducerFn?: (input: unknown) => T, thisObject?: CallBackThisObject): void;

	withFilter(watchable: Watchable, expr: string): FilterBuilder;

	addInterval(callback: () => void, delay?: number): void;

	postConstruct(): void;

	$c(): ActionContinuation;

}

export default ComponentInternals;
