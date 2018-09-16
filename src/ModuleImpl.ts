import Module from "./Module";
import SequenceGenerator from "./SequenceGenerator";

class ModuleImpl implements Module {

	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	public getName(): string {
		return this.name;
	}

	public associate(...componentClasses: any[]): Module {
		componentClasses.forEach(componentClass => {

		});

		return this;
	}

	public disassociate(...componentClasses: any[]): Module {
		componentClasses.forEach(componentClass => {

		});

		return this;
	}

	public clear(): Module {
		return this;
	}

}

export default ModuleImpl;
