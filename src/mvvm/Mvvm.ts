import ModelMediator from "@/ModelMediator";
import ComponentInternals from "@/ComponentInternals";
import Region from "@/Region";

interface Mvvm {

	init(el: HTMLElement, parent: ComponentInternals, regionLookupFn: (name: string) => Region): void;

	enableGlobal(): void;

	disableGlobal(): void;

	dispose(): void;

	getGuard(): string;

	mediate<T>(expression: string): ModelMediator<T>;

	digest(): void;

	$apply(fn: Function, args: any[]): any;

	getModelFn(): () => any;

	getItemFn(): () => any;

	getExternalFn(): () => any;

}

export default Mvvm;
