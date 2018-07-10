import Broker from './Broker';
import Disposable from '../Disposable';

interface Broadcaster extends Disposable {

	broadcast(messageName: string, payload: any): void;

	getChannelName(): string;

}

export default Broadcaster;