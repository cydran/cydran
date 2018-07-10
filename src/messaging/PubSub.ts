import Disposable from '../Disposable';
import Broadcaster from './Broadcaster';
import BroadcasterImpl from './BroadcasterImpl';
import Listener from './Listener';
import ListenerImpl from './ListenerImpl';
import Broker from './Broker';
import BrokerImpl from './BrokerImpl';

class PubSub implements Disposable {


	private broker: Broker;

	private broadcasters: Broadcaster[];

	private listeners: Listener[];

	constructor() {
		this.broker = BrokerImpl.INSTANCE;
		this.broadcasters = [];
		this.listeners = [];
	}

	public listenTo(channel: string, messageName: string, context: any, target: Function): void {
		let listener: Listener = new ListenerImpl(channel, context);
		this.broker.addListener(listener);
		this.listeners.push(listener);
		listener.register(messageName, target);
	}

	public broadcastTo(channel: string): Broadcaster {
		let broadcaster: Broadcaster = new BroadcasterImpl(channel);
		this.broker.addBroadcaster(broadcaster);
		this.broadcasters.push(broadcaster);

		return broadcaster;
	}

	public dispose(): void {
		for (let i = 0;i < this.broadcasters.length;i++) {
			let broadcaster: Broadcaster = this.broadcasters[i];
			this.broker.removeBroadcaster(broadcaster);
		}

		for (let i = 0;i < this.listeners.length;i++) {
			let listener: Listener = this.listeners[i];
			this.broker.removeListener(listener);
		}

		this.broker = null;
		this.broadcasters = [];
		this.listeners = [];
	}

}

export default PubSub;