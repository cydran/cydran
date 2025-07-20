import Provider from "interface/Provider";
import { CallBackThisObject } from 'CydranTypes';

interface Watcher<T> extends Provider<T> {

	addCallback(thisObject: CallBackThisObject, callback: () => void): Watcher<T>;

}

export default Watcher;
