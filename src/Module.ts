import Logger from "@/logger/Logger";
import Register from "@/Register";
import RegistryStrategy from "@/RegistryStrategy";
import Scope from "@/Scope";

interface Module extends Register {

	getName(): string;

	associate(...componentClasses: any[]): Module;

	disassociate(...componentClasses: any[]): Module;

	clear(): Module;

	broadcast(channelName: string, messageName: string, payload: any): void;

	message(channelName: string, messageName: string, payload: any): void;

	expose(id: string): Module;

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	getScope(): Scope;

	addStrategy(strategy: RegistryStrategy): Module;

	getLogger(): Logger;

}

export default Module;
