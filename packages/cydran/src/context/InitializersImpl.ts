import Initializers from "context/Initializers";
import { isDefined, requireNotNull } from 'util/Utils';

class InitializersImpl<C> implements Initializers<C> {

	// TODO - Correct objectThis for callbacks and weakly reference

	private callbacks: ((context? : C) => void)[];

	constructor() {
		this.callbacks = [];
	}

	public add(callback: (context? : C) => void): void {
		requireNotNull(callback, "callback");
		this.callbacks.push(callback);
	}

	public execute(context: C): void {
		while (this.callbacks.length > 0) {
			const callback: (context? : C) => void = this.callbacks.shift();

			if (isDefined(callback)) {
				callback.apply(callback, [context]);
			}
		}
	}

}

export default InitializersImpl;
