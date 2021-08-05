import Provider from "interface/Provider";

interface Watcher<T> extends Provider<T> {

	addCallback(context: any, callback: () => void): Watcher<T>;

}

export default Watcher;
