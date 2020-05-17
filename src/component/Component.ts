import ComponentInternals from "@/component/ComponentInternals";
import { ComponentConfig } from "@/component/ComponentConfig";
import MetadataContinuation from "@/component/MetadataContinuation";
import Scope from "@/model/Scope";
import { OnContinuation } from "@/message/Continuation";
import { INTERNAL_CHANNEL_NAME } from "@/constant/Constants";
import Logger from "@/logger/Logger";
import Nestable from "@/component/Nestable";
import ComponentInternalsImpl from "@/component/ComponentInternalsImpl";
import NamedElementOperations from "@/component/NamedElementOperations";
import { requireNotNull } from "@/util/ObjectUtils";

/**
 * Core class for Cydran
 */
class Component implements Nestable {

	// tslint:disable-next-line
	private ____internal$$cydran____: ComponentInternals;

	// tslint:disable-next-line
	private ____internal$$cydran$$module____: any;

	/**
	 * Constructor
	 * @param template - string value representation of a template
	 * @param config - optional {@link ComponentConfig} argument
	 */
	constructor(template: string, config?: ComponentConfig) {
		this.____internal$$cydran$$init____(template, config);
	}

	/**
	 * Get the {@link MetadataContinuation} of the {@link Component}
	 */
	public metadata(): MetadataContinuation {
		const internal: ComponentInternals = this.____internal$$cydran____;

		return {
			get: (name: string) => internal.getMetadata(name),
			has: (name: string) => internal.hasMetadata(name)
		};
	}

	/**
	 * Component has a {@link Region}
	 * @returns boolean - true | false
	 */
	public hasRegion(name: string): boolean {
		return this.____internal$$cydran____.hasRegion(name);
	}

	/**
	 * Get a child component from a region.
	 * @param name - string name value of the child {@link Component}
	 * @returns Component instance, or null
	 */
	public getChild<N extends Nestable>(name: string): N {
		return this.____internal$$cydran____.getChild(name);
	}

	/**
	 * Set a child component into a region.
	 * @param name - string name value of the child {@link Component}
	 * @param component - the {@link Component} reference
	 */
	public setChild(name: string, component: Nestable): void {
		this.____internal$$cydran____.setChild(name, component);
	}

	public setChildFromRegistry(name: string, componentName: string, defaultComponentName?: string): void {
		this.____internal$$cydran____.setChildFromRegistry(name, componentName, defaultComponentName);
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.message(channelName, messageName, payload);
	}

	public dispose(): void {
		this.____internal$$cydran____.dispose();
	}

	public getParent(): Nestable {
		return this.____internal$$cydran____.getParent();
	}

	public getEl(): HTMLElement {
		return this.____internal$$cydran____.getEl();
	}

	public get<T>(id: string): T {
		return this.____internal$$cydran____.get(id);
	}

	public scope(): Scope {
		return this.____internal$$cydran____.getScope();
	}

	public getPrefix(): string {
		return this.____internal$$cydran____.getPrefix();
	}

	public isConnected(): boolean {
		return this.____internal$$cydran____.isConnected();
	}

	public getId(): string {
		return this.____internal$$cydran____.getId();
	}

	public forElement<E extends HTMLElement>(name: string): NamedElementOperations<E> {
		return this.____internal$$cydran____.forElement(name);
	}

	public watch<T>(expression: string, target: (previous: T, current: T) => void, reducerFn?: (input: any) => T, context?: any): void {
		this.____internal$$cydran____.watch(expression, target, reducerFn, context);
	}

	public evaluate<T>(expression: string): T {
		return this.____internal$$cydran____.evaluate(expression);
	}

	public getWatchContext(): any {
		return this.____internal$$cydran____.getWatchContext();
	}

	/**
	 * @deprecated
	 */
	protected getItem<T>(): T {
		return this.____internal$$cydran____.getData() as T;
	}

	protected getValue<T>(): T {
		return this.____internal$$cydran____.getData() as T;
	}

	protected getExternals<T>(): T {
		return this.____internal$$cydran____.getExternalCache() as T;
	}

	protected broadcast(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.broadcast(channelName, messageName, payload);
	}

	protected broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		this.____internal$$cydran____.broadcastGlobally(channelName, messageName, payload);
	}

	protected $apply(fn?: Function, args?: any[]): void {
		this.____internal$$cydran____.$apply(fn, args);
	}

	protected on(messageName: string): OnContinuation {
		requireNotNull(messageName, "messageName");

		return {
			forChannel: (channelName: string) => {
				requireNotNull(channelName, "channelName");

				return {
					invoke: (target: (payload: any) => void) => {
						requireNotNull(target, "target");
						this.____internal$$cydran____.on(target, messageName, channelName);
					}
				};
			},
			invoke: (target: (payload: any) => void) => {
				requireNotNull(target, "target");
				this.____internal$$cydran____.on(target, messageName, INTERNAL_CHANNEL_NAME);
			}
		};
	}

	protected getLogger(): Logger {
		return this.____internal$$cydran____.getLogger();
	}

	protected ____internal$$cydran$$init____(template: string, config: ComponentConfig): void {
		this.____internal$$cydran____ = new ComponentInternalsImpl(this, template, config);
		this.____internal$$cydran____.init();
	}

}

export default Component;
