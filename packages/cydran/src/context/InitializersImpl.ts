import Initializers from "context/Initializers";
import { CallBackThisObject } from "CydranTypes";
import { defaulted, requireNotNull } from 'util/Utils';

type Callback<C> = (context? : C) => void;

type Registration<C> = { thisObject: CallBackThisObject; callback: Callback<C> };

class InitializersImpl<C> implements Initializers<C> {

	private callbacks: Registration<C>[];

	constructor() {
		this.callbacks = [];
	}

	public add(thisObject: CallBackThisObject, callback: (context? : C) => void): void {
		requireNotNull(callback, "callback");
		this.callbacks.push({ thisObject: defaulted(thisObject, {}), callback: callback });
	}

	public execute(context: C): void {
		for (const registration of this.callbacks) {
			registration.callback.call(registration.thisObject, context);
		}

		this.callbacks = [];
	}

}

export default InitializersImpl;
