import AbstractFunctionalFactory from "registry/AbstractFunctionalFactory";
import Context from "context/Context";
import Gettable from "interface/ables/Gettable";
import { safeCydranDisposal } from "util/Utils";
import ArgumentsResolvers from "argument/ArgumentsResolvers";

class SingletonFactory<T> extends AbstractFunctionalFactory<T> {

	private instance: T;

	constructor(context: Context, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		super(context, fn, argumentResolvers);
		this.instance = null;
	}

	public get(gettable: Gettable): T {
		if (!this.instance) {
			this.instance = this.create(gettable);
		}

		return this.instance;
	}

	public $dispose(): void {
		safeCydranDisposal(this.instance);
	}

}

export default SingletonFactory;
