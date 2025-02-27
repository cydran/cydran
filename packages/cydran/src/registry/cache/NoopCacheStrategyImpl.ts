import CacheStrategy from "registry/cache/CacheStrategy";

class NoopCacheStrategyImpl<T> implements CacheStrategy<T> {

	public resolve(supplier: () => T): T {
		const value: T = supplier();

		return value;
	}

	public $release(): void {
		// Intentionally do nothing
	}

}

export default NoopCacheStrategyImpl;
