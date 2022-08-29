import AbstractFunctionalFactory from "registry/AbstractFunctionalFactory";
import Context from "context/Context";
import Gettable from "interface/ables/Gettable";
import ArgumentsResolvers from "argument/ArgumentsResolvers";

class PrototypeFactory<T> extends AbstractFunctionalFactory<T> {

	constructor(context: Context, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		super(context, fn, argumentResolvers);
	}

	public get(gettable: Gettable): T {
		return this.create(gettable);
	}

	public $dispose(): void {
		// intentional no-opp
	}

}

export default PrototypeFactory;
