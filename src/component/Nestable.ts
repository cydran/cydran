import Disposable from "@/pattern/Disposable";
import Scope from "@/model/Scope";
import MetadataContinuation from "@/component/MetadataContinuation";
import Watchable from "@/model/Watchable";
import Messagable from "@/message/Messagable";
import { Properties } from "@/properties/Interfaces";

interface Nestable extends Disposable, Watchable, Messagable {

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

	isConnected(): boolean;

	getId(): string;

	getProperties(): Properties;

}

export default Nestable;
