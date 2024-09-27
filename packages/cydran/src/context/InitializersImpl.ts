import Initializers from "context/Initializers";
import { isDefined, requireNotNull } from 'util/Utils';

class InitializersImpl<C> implements Initializers<C> {

	private callbacks: {
		callback: ((context? : C) => void);
		thisObject: any;
	}[];

	constructor() {
		this.callbacks = [];
	}

	public add(thisObject: any, callback: (context? : C) => void): void {
		requireNotNull(callback, "callback");
		this.callbacks.push({
			callback: callback,
			thisObject: isDefined(thisObject) ? thisObject : {}
		});
	}

	public execute(context: C): void {
		while (this.callbacks.length > 0) {
			const mapping: { callback: ((context? : C) => void), thisObject: any } = this.callbacks.shift();
			const callback: (context? : C) => void = mapping.callback;
			const thisObject: any = mapping.thisObject;

			if (isDefined(callback)) {
				callback.apply(thisObject, [context]);
			}
		}
	}

}

export default InitializersImpl;
