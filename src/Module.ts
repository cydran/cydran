import Listener from "./messaging/Listener";
import RegistryStrategy from "./RegistryStrategy";
import Register from "./Register";
import Logger from "./logger/Logger";

interface Module extends Register {

	getName(): string;

	associate(...componentClasses: any[]): Module;

	disassociate(...componentClasses: any[]): Module;

	clear(): Module;

	broadcast(channelName: string, messageName: string, payload: any): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;

	expose(id: string): Module;

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	addStrategy(strategy: RegistryStrategy): Module;

	getLogger(): Logger;

}

export default Module;
