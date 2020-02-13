import Mvvm from "@/mvvm/Mvvm";
import ComponentInternals from "@/component/ComponentInternals";

/**
 * Dependencies for {@link ElementMediator}
 */
interface ElementMediatorDependencies {

	/**
	 * The {@link Mvvm} connected to the {@link ElementMediator}
	 */
	mvvm: Mvvm;

	/**
	 * Guts of a {@link Component}
	 */
	parent: ComponentInternals;

	/**
	 * The bound HTML element
	 */
	el: HTMLElement;

	/**
	 * The bound expression of "truthiness"
	 */
	expression: string;

	/**
	 * The bound Cydran model of the {@link Component}
	 */
	model: any;

	/**
	 * The bound namespace/Cydran prefix.  Defaults to "c:"
	 */
	prefix: string;

}

export default ElementMediatorDependencies;
