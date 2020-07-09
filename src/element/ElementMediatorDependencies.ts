import Mvvm from "@/mvvm/Mvvm";
import ComponentInternals from "@/component/ComponentInternals";
import Module from "@/module/Module";

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
	el: HTMLElement | Text;

	/**
	 * The bound expression of "truthiness"
	 */
	expression: string;

	/**
	 * The bound Cydran model of the {@link Component}
	 */
	model: any;

	/**
	 * Prefix of any Cydran attribute.
	 */
	prefix: string;

	/**
	 * Attribute prefix of the mediator.
	 */
	mediatorPrefix: string;

	/**
	 * Module instance.
	 */
	module: Module;

	/**
	 * Whether validation is active.
	 */
	validated: boolean;

}

export default ElementMediatorDependencies;
