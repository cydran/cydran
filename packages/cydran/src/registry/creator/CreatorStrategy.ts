import Releasable from "interface/ables/Releasable";

interface CreatorStrategy<T> extends Releasable {

	create(): (argumentValues: any[]) => T;

}

export default CreatorStrategy;
