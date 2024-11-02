import Initializers from "context/Initializers";
import GarbageCollectablePairedSet from "pattern/GarbageCollectablePairedSet";
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { defaulted, requireNotNull } from 'util/Utils';

type Callback<C> = (context? : C) => void;

class InitializersImpl<C> implements Initializers<C> {

	private callbacks: GarbageCollectablePairedSet<Object, Callback<C>, Object>;

	constructor() {
		this.callbacks = new GarbageCollectablePairedSetImpl<Object, Callback<C>, Object>();
	}

	public add(thisObject: Object, callback: (context? : C) => void): void {
		requireNotNull(callback, "callback");
		this.callbacks.add(defaulted(thisObject, {}), callback);
	}

	public execute(context: C): void {
		this.callbacks.forEach((thisObject: Object, callback: Callback<C>) => {
			callback.call(thisObject, context);
		});

		this.callbacks.clear();
	}

}

export default InitializersImpl;
