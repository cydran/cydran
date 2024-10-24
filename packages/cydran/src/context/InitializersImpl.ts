import Initializers from "context/Initializers";
import GarbageCollectableSet from "pattern/GarbageCollectableSet";
import GarbageCollectableSetImpl from "pattern/GarbageCollectableSetImpl";
import { requireNotNull } from 'util/Utils';

type Callback<C> = (context? : C) => void;

class InitializersImpl<C> implements Initializers<C> {

	private callbacks: GarbageCollectableSet<Callback<C>, Object>;

	constructor() {
		this.callbacks = new GarbageCollectableSetImpl<Callback<C>, Object>();
	}

	public add(thisObject: Object = {}, callback: (context? : C) => void): void {
		requireNotNull(callback, "callback");
		this.callbacks.add(callback, thisObject);
	}

	public execute(context: C): void {
		this.callbacks.forEach((callback: Callback<C>, thisObject: Object) => {
			callback.call(thisObject, context);
		});

		this.callbacks.clear();
	}

}

export default InitializersImpl;
