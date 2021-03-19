import Disposable from "@/interface/ables/Disposable";
import Gettable from "@/interface/ables/Gettable";

interface Factory<T> extends Disposable {

	get(gettable: Gettable): T;

}

export default Factory;