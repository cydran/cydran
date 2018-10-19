import Listener from "./messaging/Listener";
import RegistryStrategy from "./RegistryStrategy";

interface Module {

	getName(): string;

	associate(...componentClasses: any[]): Module;

	disassociate(...componentClasses: any[]): Module;

	clear(): Module;

	broadcast(channelName: string, messageName: string, payload: any): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;

	registerConstant(id: string, instance: any): Module;

	registerPrototype(id: string, classInstance: any): Module;

	registerSingleton(id: string, classInstance: any): Module;

	expose(id: string): Module;

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	addStrategy(strategy: RegistryStrategy): Module;

}

export default Module;
