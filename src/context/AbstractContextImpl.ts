import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Context from "context/Context";
import Type from "interface/Type";
import Logger from "log/Logger";
import PubSub from "message/PubSub";
import { MutableProperties } from "properties/Property";
import RegistryStrategy from "registry/RegistryStrategy";
import Scope from "scope/Scope";
import Services from "service/Services";
import { requireNotNull, defaultAsNull, isDefined } from 'util/Utils';
import SimpleMap from 'interface/SimpleMap';
import { NamingConflictError } from "error/Errors";
import ChildContextImpl from "context/ChildContextImpl";

abstract class AbstractContextImpl implements Context {

	private name: string;

	private children: SimpleMap<Context>;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
		this.children = {};
	}

	// -----------------------------------------------------------

	public abstract getRoot(): Context;

	public abstract isRoot(): boolean;

	public abstract getParent(): Context;

	// -----------------------------------------------------------

	public getName(): string {
		return this.name;
	}

	public getChild(name: string): Context {
		return defaultAsNull(this.children[name]);
	}

	public hasChild(name: string): boolean {
		return isDefined(this.children[name]);
	}

	public addchild(name: string, initializer?: (context: Context) => void): Context {
		requireNotNull(name, "name");

		if (isDefined(this.children[name])) {
			throw new NamingConflictError("Child context name already exists: " + name);
		}

		const child: Context = new ChildContextImpl(name, this);

		this.children[name] = child;

		if (isDefined(initializer)) {
			initializer(child);
		}

		return child;
	}

	// -----------------------------------------------------------

	public removeChild(name: string): Context {
		throw new Error("Method not implemented.");
	}

	public getLogger(): Logger {
		throw new Error("Method not implemented.");
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public get<T>(id: string): T {
		throw new Error("Method not implemented.");
	}

	public getLocal<T>(id: string): T {
		throw new Error("Method not implemented.");
	}

	public hasRegistration(id: string): boolean {
		throw new Error("Method not implemented.");
	}

	public addStrategy(strategy: RegistryStrategy): Context {
		throw new Error("Method not implemented.");
	}

	public expose(id: string): Context {
		throw new Error("Method not implemented.");
	}

	public clear(): Context {
		throw new Error("Method not implemented.");
	}

	public getProperties(): MutableProperties {
		throw new Error("Method not implemented.");
	}

	public getScope(): Scope {
		throw new Error("Method not implemented.");
	}

	public createPubSubFor(targetThis: any): PubSub {
		throw new Error("Method not implemented.");
	}

	public getServices(): Services {
		throw new Error("Method not implemented.");
	}

	public registerConstant(id: string, instance: any) {
		throw new Error("Method not implemented.");
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers) {
		throw new Error("Method not implemented.");
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers) {
		throw new Error("Method not implemented.");
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers) {
		throw new Error("Method not implemented.");
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers) {
		throw new Error("Method not implemented.");
	}

	public $dispose(): void {
		throw new Error("Method not implemented.");
	}

	public tell(name: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

}

export default AbstractContextImpl;
