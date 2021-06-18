import Factory from "register/Factory";
import Module from "module/Module";
import Disposable from "interface/ables/Disposable";
import Gettable from "interface/ables/Gettable";
import PubSubImpl from "message/PubSubImpl";

import { startsWith, removeFromBeginning } from "util/Utils";
import ArgumentsResolvers from "stage/ArgumentsResolvers";

abstract class AbstractFunctionalFactory<T> implements Factory<T>, Disposable {
	private fn: (args: any[]) => T;

	private argumentResolvers: ArgumentsResolvers;

	private module: Module;

	constructor(module: Module, fn: (args: any[]) => T, argumentResolvers: ArgumentsResolvers) {
		this.module = module;
		this.argumentResolvers = argumentResolvers;
		this.fn = fn;
	}

	public abstract get(gettable: Gettable): T;

	protected create(gettable: Gettable) {
		const pubSubs: PubSubImpl[] = [];
		const params: any[] = this.argumentResolvers.resolve(this.module);
		const result: T = this.fn.apply({}, params);
		this.argumentResolvers.postProcess(this.module, result, params);

		return result;
	}

	public abstract $dispose(): void;

}

export default AbstractFunctionalFactory;
