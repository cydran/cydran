import { MetadataContinuation } from "interface/Component";
import { Scope } from "interface/General";
import { Properties } from "interface/Property";

interface Notifyable {
	notify(): void;
}

interface Evaluatable {
	evaluate(): boolean;
}

interface Tellable {
	tell(name: string, payload?: any): void;
}

interface Messagable {
	message(channelName: string, messageName: string, payload?: any): void;
}

interface Watchable {
	watch<T>(
		expression: string,
		target: (previous: T, current: T) => void,
		reducerFn?: (input: any) => T,
		context?: any
	): void;

	evaluate<T>(expression: string): T;

	getWatchContext(): any;
}

interface Disposable {
	$dispose(): void;
}

interface Nestable extends Disposable, Watchable, Messagable, Tellable {
	metadata(): MetadataContinuation;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(
		name: string,
		componentName: string,
		defaultComponentName?: string
	): void;

	getParent(): Nestable;

	getEl(): HTMLElement;

	get<T>(id: string): T;

	scope(): Scope;

	getPrefix(): string;

	isMounted(): boolean;

	isConnected(): boolean;

	getId(): string;

	getProperties(): Properties;
}

interface Digestable {
	$apply(fn: Function, args: any[]): any;
}

export {
	Digestable,
	Disposable,
	Evaluatable,
	Messagable,
	Nestable,
	Tellable,
	Watchable,
	Notifyable
};
