import AbstractFunctionalFactory from "registry/AbstractFunctionalFactory";
import Module from "module/Module";
import Gettable from "interface/ables/Gettable";
import { safeCydranDisposal } from "util/Utils";
import ArgumentsResolvers from "argument/ArgumentsResolvers";

class SingletonFactory<T> extends AbstractFunctionalFactory<T> {

	private instance: T;

	constructor(module: Module, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		super(module, fn, argumentResolvers);
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
