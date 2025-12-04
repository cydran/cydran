import Releasable from "interface/ables/Releasable";

interface CreatorStrategy<T> extends Releasable {

	create(): (argumentValues: unknown[]) => T;

}

export default CreatorStrategy;
