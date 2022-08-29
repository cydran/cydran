import ComponentInternals from "component/ComponentInternals";
import Context from "context/Context";
import Services from "service/Services";

interface BehaviorDependencies {
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
	 * Attribute prefix of the behavior.
	 */
	behaviorPrefix: string;

	/**
	 * Context instance.
	 */
	context: Context;

	/**
	 * Whether validation is active.
	 */
	validated: boolean;

	/**
	 * Whether the expression is mutable.
	 */
	mutable: boolean;

	/**
	 * Cydran services.
	 */
	 services: Services;

}

export default BehaviorDependencies;
