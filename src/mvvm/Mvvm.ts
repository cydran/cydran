import ModelMediator from "@/model/ModelMediator";
import ComponentInternals from "@/component/ComponentInternals";
import Region from "@/component/Region";
import MediatorSource from "@/mvvm/MediatorSource";
import ScopeImpl from "@/model/ScopeImpl";
import Messagable from "@/message/Messagable";
import Module from "@/module/Module";
import AttributeExtractor from "@/mvvm/AttributeExtractor";

interface Mvvm extends MediatorSource {

	init(el: HTMLElement, parent: ComponentInternals, regionAddFn: (name: string, element: HTMLElement, locked: boolean) => Region): void;

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

	getModule(): Module;

	getModel(): any;

	createRegionName(): string;

	addRegion(name: string, element: HTMLElement, locked: boolean): Region;

	addNamedElement(name: string, element: HTMLElement): void;

	addMediator(mediator: any): void;

	addPropagatingElementMediator(mediator: any): void;

	getExtractor(): AttributeExtractor;

}

export default Mvvm;
