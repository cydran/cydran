import Listener from "./messaging/Listener";
import {Registry} from "./Registry";

interface Module {

	getName(): string;

	associate(...componentClasses: any[]): Module;

	disassociate(...componentClasses: any[]): Module;

	clear(): Module;

	getRegistry(): Registry;

	broadcast(channelName: string, messageName: string, payload: any): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;

	get<T>(id: string): T;

}

export default Module;
