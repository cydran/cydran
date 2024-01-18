import AbstractFunctionalFactory from "registry/AbstractFunctionalFactory";
import Gettable from "interface/ables/Gettable";
import { safeCydranDisposal } from "util/Utils";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context } from "context/Context";

class SingletonFactory<T> extends AbstractFunctionalFactory<T> {

	private instance: T;

	constructor(context: Context, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		super(context, fn, argumentResolvers);
		this.instance = null;
	}

	public get(gettable: Gettable, ...instanceArguments: any[]): T {
		if (!this.instance) {
			this.instance = this.create(gettable, instanceArguments);
		}

		return this.instance;
	}

	public $dispose(): void {
		safeCydranDisposal(this.instance);
	}

}

export default SingletonFactory;
