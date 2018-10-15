import Listener from "./messaging/Listener";
import {Registry} from "./Registry";

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

	get<T>(id: string): T;

}

export default Module;
