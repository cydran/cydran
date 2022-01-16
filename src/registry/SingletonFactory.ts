import AbstractFunctionalFactory from "registry/AbstractFunctionalFactory";
import Module from "module/Module";
import Gettable from "interface/ables/Gettable";
import Disposable from "interface/ables/Disposable";
import { isDefined } from "util/Utils";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import JSType from "const/JSType";

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
		const disposeFn: any = this.instance["$dispose"];

		if (isDefined(disposeFn) && typeof disposeFn === JSType.FN) {
			((this.instance as unknown) as Disposable).$dispose();
		}
	}

}

export default SingletonFactory;
