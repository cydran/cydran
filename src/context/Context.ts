import Tellable from "interface/ables/Tellable";
import Scope from "scope/Scope";
import Register from "registry/Register";
import RegistryStrategy from "registry/RegistryStrategy";
import PubSub from "message/PubSub";
import Logger from "log/Logger";
import { MutableProperties } from "properties/Property";
import Services from "service/Services";

interface Context extends Register, Tellable {

	// Context

	getName(): string;

	getLogger(): Logger;

	getChild(name: string): Context;

	getRoot(): Context;

	isRoot(): boolean;

	getParent(): Context;

	hasChild(name: string): boolean;

	addchild(name: string, initializer?: (context: Context) => void): Context;

	removeChild(name: string): Context;

	// Messaging

	message(channelName: string, messageName: string, payload?: any): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	// DI

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	hasRegistration(id: string): boolean;

	addStrategy(strategy: RegistryStrategy): Context;

	expose(id: string): Context;

	clear(): Context;

	// Properties

	getProperties(): MutableProperties;

	// Unsorted

	getScope(): Scope;

	createPubSubFor(targetThis: any): PubSub;

	getServices(): Services;

}

export default Context;
