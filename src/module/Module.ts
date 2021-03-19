import Nestable from "@/interface/ables/Nestable";
import Tellable from "@/interface/ables/Tellable";
import Type from "@/interface/Type";
import { MutableProperties } from '@/interface/Property';
import Register from "@/register/Register";
import PubSub from "@/message/PubSub";
import Scope from "@/scope/Scope";
import Logger from "@/log/Logger";
import RegistryStrategy from "@/register/RegistryStrategy";

interface Module extends Register, Tellable {

	getName(): string;

	associate(...componentClasses: Type<Nestable>[]): Module;

	disassociate(...componentClasses: Type<Nestable>[]): Module;

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

	hasRegistration(id: string, moduleName?: string): boolean;

	addStrategy(strategy: RegistryStrategy): Module;

	getLogger(): Logger;

	createPubSubFor(context: any): PubSub;

	getProperties(): MutableProperties;

}

export default Module;