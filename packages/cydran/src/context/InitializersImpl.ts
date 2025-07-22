import Initializers from "context/Initializers";
import { CallBackThisObject } from "CydranTypes";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { defaulted, requireNotNull } from 'util/Utils';

type Callback<C> = (context? : C) => void;

class InitializersImpl<C> implements Initializers<C> {

	private callbacks: GarbageCollectablePairedSet<CallBackThisObject, Callback<C>, CallBackThisObject>;

	constructor() {
		this.callbacks = new GarbageCollectablePairedSetImpl<CallBackThisObject, Callback<C>, CallBackThisObject>();
	}

	public add(thisObject: CallBackThisObject, callback: (context? : C) => void): void {
		requireNotNull(callback, "callback");
		this.callbacks.add(defaulted(thisObject, {}), callback);
	}

	public execute(context: C): void {
		this.callbacks.forEach((thisObject: CallBackThisObject, callback: Callback<C>) => {
			callback.call(thisObject, context);
		});

		this.callbacks.clear();
	}

}

export default InitializersImpl;
