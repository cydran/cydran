import ComponentInternals from 'component/ComponentInternals';
import { Nestable, RegionContinuation } from "interface/ComponentInterfaces";
import { requireNotNull } from 'util/Utils';

class RegionContinuationImpl implements RegionContinuation {

	private internals: ComponentInternals;

	constructor(internals: ComponentInternals) {
		this.internals = requireNotNull(internals, "internals");
	}

	/**
	 * Component has a {@link Region}
	 * @returns boolean - true | false
	 */
	 public has(name: string): boolean {
		return this.internals.hasRegion(name);
	}

	/**
	 * Get a child component from a region.
	 * @param name - string name value of the child {@link Component}
	 * @returns Component instance, or null
	 */
	public get<N extends Nestable>(name: string): N {
		return this.internals.getChild(name);
	}

	/**
	 * Set a child component into a region.
	 * @param name - string name value of the child {@link Component}
	 * @param component - the {@link Component} reference
	 */
	public set(name: string, component: Nestable): void {
		this.internals.setChild(name, component);
	}

	public setFromRegistry(name: string, componentName: string, defaultComponentName?: string): void {
		this.internals.setChildFromRegistry(name, componentName, defaultComponentName);
	}

}

export default RegionContinuationImpl;
