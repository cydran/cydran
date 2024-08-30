import AbstractFunctionalFactory from "registry/AbstractFunctionalFactory";
import Gettable from "interface/ables/Gettable";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context } from "context/Context";

class PrototypeFactory<T> extends AbstractFunctionalFactory<T> {

	constructor(context: Context, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		super(context, fn, argumentResolvers);
	}

	public get(gettable: Gettable, instanceArguments: any[] = []): T {
		return this.create(gettable, instanceArguments);
	}

	public $release(): void {
		// intentional no-opp
	}

}

export default PrototypeFactory;
