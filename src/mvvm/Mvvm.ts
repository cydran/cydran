import ModelMediator from "@/model/ModelMediator";
import ComponentInternals from "@/component/ComponentInternals";
import Region from "@/component/Region";
import MediatorSource from "@/mvvm/MediatorSource";
import ScopeImpl from "@/model/ScopeImpl";
import Messagable from "@/message/Messagable";

interface Mvvm extends MediatorSource {

	init(el: HTMLElement, parent: ComponentInternals, regionLookupFn: (name: string) => Region): void;

	nestingChanged(): void;

	dispose(): void;

	getId(): string;

	getNamedElement<E extends HTMLElement>(name: string): E;

	mediate<T>(expression: string, reducerFn?: (input: any) => T): ModelMediator<T>;

	digest(): void;

	$apply(fn: Function, args: any[]): any;

	getModelFn(): () => any;

	getItemFn(): () => any;

	getScope(): ScopeImpl;

	getParent(): ComponentInternals;

	skipId(id: string): void;

	getMessagables(): Messagable[];

}

export default Mvvm;
