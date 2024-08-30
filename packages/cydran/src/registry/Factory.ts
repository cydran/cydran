import Gettable from "interface/ables/Gettable";
import Releasable from "interface/ables/Releasable";

interface Factory<T> extends Releasable {

	get(gettable: Gettable, instanceArguments: any[]): T;

}

export default Factory;
