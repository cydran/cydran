import Gettable from "interface/ables/Gettable";
import Disposable from "interface/ables/Disposable";

interface Factory<T> extends Disposable {

	get(gettable: Gettable): T;

}

export default Factory;
