import AbstractFunctionalFactory from "register/AbstractFunctionalFactory";
import Module from "module/Module";
import Gettable from "interface/ables/Gettable";

class PrototypeFactory<T> extends AbstractFunctionalFactory<T> {

	constructor(module: Module, fn: (args: any[]) => T, dependencies: string[]) {
		super(module, fn, dependencies);
	}

	public get(gettable: Gettable): T {
		return this.create(gettable);
	}

	public $dispose(): void {
		// intentional no-opp
	}
	
}

export default PrototypeFactory;
