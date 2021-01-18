import AbstractFunctionalFactory from "register/AbstractFunctionalFactory";
import Module from "module/Module";
import Gettable from "interface/ables/Gettable";
import Disposable from "interface/ables/Disposable";
import { isDefined } from "util/Utils";

class SingletonFactory<T> extends AbstractFunctionalFactory<T> {
	private instance: T;

	constructor(module: Module, fn: (args: any[]) => T, dependencies: string[]) {
		super(module, fn, dependencies);
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

		if (isDefined(disposeFn) && typeof disposeFn === "function") {
			((this.instance as unknown) as Disposable).$dispose();
		}
	}
}

export default SingletonFactory;