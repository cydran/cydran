import Listener from './Listener';
import Broadcaster from './Broadcaster';
import Disposable from '../Disposable';

interface Broker extends Disposable {

	broadcast(channelName: string, messageName: string, payload: any): void;

	addBroadcaster(broadcaster: Broadcaster): void;

	removeBroadcaster(broadcaster: Broadcaster): void;

	addListener(listener: Listener): void;

	removeListener(listener: Listener): void;

}

export default Broker;