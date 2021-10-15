import Component from "component/Component";
import { requireNotNull } from 'util/Utils';

class ComponentHarness {

	private root: Component;

	constructor(root: Component) {
		this.root = requireNotNull(root, "root");
	}

	public test(): void {
		// TODO - Implement
	}

}

export default ComponentHarness;
