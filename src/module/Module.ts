import Logger from "@/logger/Logger";
import Register from "@/registry/Register";
import Scope from "@/model/Scope";
import RegistryStrategy from "@/registry/RegistryStrategy";
import PubSub from "@/message/PubSub";

interface Module extends Register {

	getName(): string;

	associate(...componentClasses: any[]): Module;

	disassociate(...componentClasses: any[]): Module;

	clear(): Module;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	message(channelName: string, messageName: string, payload?: any): void;

	getDefaultModule(): Module;

	getModule(name: string): Module;

	expose(id: string): Module;

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	getScope(): Scope;

	addStrategy(strategy: RegistryStrategy): Module;

	getLogger(): Logger;

	createPubSubFor(context: any): PubSub;

}

export default Module;
