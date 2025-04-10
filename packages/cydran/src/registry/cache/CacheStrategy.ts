import Releasable from "interface/ables/Releasable";

interface CacheStrategy<T> extends Releasable {

	resolve(supplier: () => T): T;

}

export default CacheStrategy;
