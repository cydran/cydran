import AbstractFunctionalFactory from "register/AbstractFunctionalFactory";
import Module from "module/Module";
import Gettable from "interface/ables/Gettable";
import ArgumentsResolvers from "stage/ArgumentsResolvers";

class PrototypeFactory<T> extends AbstractFunctionalFactory<T> {

	constructor(module: Module, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		super(module, fn, argumentResolvers);
	}

	public get(gettable: Gettable): T {
		return this.create(gettable);
	}

	public $dispose(): void {
		// intentional no-opp
	}
}

export default PrototypeFactory;
