import Tellable from "interface/ables/Tellable";
import Type from "interface/Type";
import Scope from "scope/Scope";
import Register from "registry/Register";
import RegistryStrategy from "registry/RegistryStrategy";
import PubSub from "message/PubSub";
import Logger from "log/Logger";
import { MutableProperties } from "properties/Property";
import Services from "service/Services";
import { Nestable } from "interface/ComponentInterfaces";

interface Context extends Register, Tellable {

	getName(): string;

	associate(...componentClasses: Type<Nestable>[]): Context;

	disassociate(...componentClasses: Type<Nestable>[]): Context;

	clear(): Context;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	message(channelName: string, messageName: string, payload?: any): void;

	getDefaultContext(): Context;

	getContext(name: string): Context;

	expose(id: string): Context;

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	getScope(): Scope;

	hasRegistration(id: string): boolean;

	addStrategy(strategy: RegistryStrategy): Context;

	getLogger(): Logger;

	createPubSubFor(targetThis: any): PubSub;

	getProperties(): MutableProperties;

	getServices(): Services;

}

export default Context;
