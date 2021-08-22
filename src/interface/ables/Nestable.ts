import Scope from "scope/Scope";
import Disposable from "interface/ables/Disposable";
import Watchable from "interface/ables/Watchable";
import Messagable from "interface/ables/Messagable";
import Tellable from "interface/ables/Tellable";
import { Properties } from "properties/Property";

import MetadataContinuation from "component/MetadataContinuation";

interface Nestable extends Disposable, Watchable, Messagable, Tellable {

	metadata(): MetadataContinuation;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentName: string, defaultComponentName?: string): void;

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

export default Nestable;
