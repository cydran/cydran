import Disposable from "@/pattern/Disposable";
import Scope from "@/model/Scope";
import MetadataContinuation from "@/component/MetadataContinuation";

interface Nestable extends Disposable {

	metadata(): MetadataContinuation;

	hasRegion(name: string): boolean;

	getChild<N extends Nestable>(name: string): N;

	setChild(name: string, component: Nestable): void;

	setChildFromRegistry(name: string, componentName: string, defaultComponentName?: string): void;

	message(channelName: string, messageName: string, payload?: any): void;

	getParent(): Nestable;

	getEl(): HTMLElement;

	get<T>(id: string): T;

	scope(): Scope;

	reset(): void;

	getPrefix(): string;

	isConnected(): boolean;

	getId(): string;

}

export default Nestable;
