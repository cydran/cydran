import CacheStrategy from "registry/cache/CacheStrategy";
import { isDefined } from "util/Utils";

interface Holder<T> {

	get(): T;

}

class HolderImpl<T> implements Holder<T> {

	private value: T;

	constructor(value: T) {
		this.value = value;
	}

	public get(): T {
		return this.value;
	}

}

class MemoizationCacheStrategyImpl<T> implements CacheStrategy<T> {

	private holder: Holder<T> = null;

	public resolve(supplier: () => T): T {
		if (!isDefined(this.holder)) {
			const value: T = supplier();
			this.holder = new HolderImpl(value);
		}

		return this.holder.get();
	}

	public $release(): void {
		this.holder = null;
	}

}

export default MemoizationCacheStrategyImpl;