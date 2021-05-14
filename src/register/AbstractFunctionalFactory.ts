import Factory from "register/Factory";
import Module from "module/Module";
import Disposable from "interface/ables/Disposable";
import Gettable from "interface/ables/Gettable";
import PubSubImpl from "message/PubSubImpl";

import { startsWith, removeFromBeginning } from "util/Utils";

abstract class AbstractFunctionalFactory<T> implements Factory<T>, Disposable {
	
	private fn: (args: any[]) => T;

	private dependencies: string[];

	private module: Module;

	constructor(module: Module, fn: (args: any[]) => T, dependencies: string[]) {
		this.module = module;
		this.dependencies = dependencies;
		this.fn = fn;
	}

	public abstract get(gettable: Gettable): T;

	protected create(gettable: Gettable) {
		const params: any[] = [];

		const pubSubs: PubSubImpl[] = [];

		for (const id of this.dependencies) {
			if (id === "$pubSub") {
				const pubSub: PubSubImpl = new PubSubImpl(null, this.module);
				params.push(pubSub);
				pubSubs.push(pubSub);
			} else if (startsWith(id, "$prop:")) {
				const key = removeFromBeginning(id, "$prop:");
				const value: any = this.module.getProperties().get(key);
				params.push(value);
			} else {
				const param: any = gettable.get(id);
				params.push(param);
			}
		}

		const result: T = this.fn.apply({}, params);

		for (const pubSub of pubSubs) {
			pubSub.setContext(result);
		}

		return result;
	}

	public abstract $dispose(): void;

}

export default AbstractFunctionalFactory;
