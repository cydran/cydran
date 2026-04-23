import Pair from 'pattern/Pair';
import { requireNotNull } from 'util/Utils';

class RefPair<I extends object, J extends object> {

	private firstRef: WeakRef<I>;

	private secondRef: WeakRef<J>;

	constructor(first: I, second: J) {
		requireNotNull(first, "first");
		requireNotNull(second, "second");

		this.firstRef = new WeakRef(first);
		this.secondRef = new WeakRef(second);
	}

	public deref(): Pair<I, J> | undefined {
		const currentFirst: I | undefined = this.firstRef.deref();
		const currentSecond: J | undefined = this.secondRef.deref();

		return currentFirst !== undefined && currentSecond !== undefined ? { first: currentFirst, second: currentSecond } : undefined;
	}

}

export default RefPair;