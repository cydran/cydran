import Provider from "interface/Provider";

interface Watcher<T> extends Provider<T> {

	addCallback(thisObject: Object, callback: () => void): Watcher<T>;

}

export default Watcher;
