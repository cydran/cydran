import Pair from 'pattern/Pair';
import { isDefined, requireNotNull } from 'util/Utils';

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
		const missing: boolean = !isDefined(currentFirst) || !isDefined(currentSecond);

		return missing ? undefined: { first: currentFirst, second: currentSecond } as Pair<I, J>;
	}

}

export default RefPair;