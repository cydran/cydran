import Tellable from "interface/ables/Tellable";
import Scope from "scope/Scope";
import Register from "registry/Register";
import RegistryStrategy from "registry/RegistryStrategy";
import PubSub from "message/PubSub";
import Logger from "log/Logger";
import { MutableProperties } from "properties/Property";
import Sendable from "interface/ables/Sendable";

interface Context extends Register, Tellable, Sendable {

	// Context

	getName(): string;

	getLogger(): Logger;

	getChild(name: string): Context;

	getRoot(): Context;

	isRoot(): boolean;

	getParent(): Context;

	hasChild(name: string): boolean;

	addChild(name: string, initializer?: (context: Context) => void): Context;

	removeChild(name: string): void;

	// DI

	getObject<T>(id: string): T;

	getLocalObject<T>(id: string): T;

	hasRegistration(id: string): boolean;

	addStrategy(strategy: RegistryStrategy): Context;

	expose(id: string): Context;

	// Properties

	getProperties(): MutableProperties;

	// Unsorted

	getScope(): Scope;

	createPubSubFor(targetThis: any): PubSub;

}

export default Context;
