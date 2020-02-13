import ModelMediator from "@/model/ModelMediator";
import ComponentInternals from "@/component/ComponentInternals";
import Region from "@/component/Region";

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
