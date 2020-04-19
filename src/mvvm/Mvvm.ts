import ModelMediator from "@/model/ModelMediator";
import ComponentInternals from "@/component/ComponentInternals";
import Region from "@/component/Region";
import MediatorSource from "@/mvvm/MediatorSource";

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

	getExternalFn(): () => any;

	getParent(): ComponentInternals;

	skipId(id: string): void;

}

export default Mvvm;
