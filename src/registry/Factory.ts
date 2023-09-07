import Gettable from "interface/ables/Gettable";
import Disposable from "interface/ables/Disposable";

interface Factory<T> extends Disposable {

	// TODO - Support passing arguments for argument argument resolver

	get(gettable: Gettable): T;

}

export default Factory;
