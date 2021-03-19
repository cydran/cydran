import Supplier from "@/interface/Supplier";

interface Watcher<T> extends Supplier<T> {

	addCallback(context: any, callback: () => void): Watcher<T>;

}

export default Watcher;