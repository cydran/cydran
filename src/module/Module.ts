import Tellable from "interface/ables/Tellable";
import Nestable from "interface/ables/Nestable";
import Type from "interface/Type";
import Scope from "scope/Scope";
import Register from "register/Register";
import RegistryStrategy from "register/RegistryStrategy";
import PubSub from "message/PubSub";
import Logger from "log/Logger";

import { MutableProperties } from "interface/Property";

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
