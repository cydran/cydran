import Disposable from '../Disposable';
import Broadcaster from './Broadcaster';
import BroadcasterImpl from './BroadcasterImpl';
import Listener from './Listener';
import ListenerImpl from './ListenerImpl';
import Broker from './Broker';
import {Registry} from '../Registry';

class PubSub implements Disposable {

	private broker: Broker;

	private broadcasters: Broadcaster[];

	private listeners: Listener[];

	constructor() {
		this.broadcasters = [];
		this.listeners = [];
	}

	public listenTo(channel: string, messageName: string, context: any, target: Function): void {
		let broker: Broker = Registry.get('cydran:broker');
		let listener: Listener = new ListenerImpl(channel, context);
		broker.addListener(listener);
		this.listeners.push(listener);
		listener.register(messageName, target);
	}

	public broadcastTo(channel: string): Broadcaster {
		let broker: Broker = Registry.get('cydran:broker');
		let broadcaster: Broadcaster = new BroadcasterImpl(channel);
		broker.addBroadcaster(broadcaster);
		this.broadcasters.push(broadcaster);

		return broadcaster;
	}

	public dispose(): void {
		let broker: Broker = Registry.get('cydran:broker');

		for (let i = 0;i < this.broadcasters.length;i++) {
			let broadcaster: Broadcaster = this.broadcasters[i];
			broker.removeBroadcaster(broadcaster);
		}

		for (let i = 0;i < this.listeners.length;i++) {
			let listener: Listener = this.listeners[i];
			broker.removeListener(listener);
		}

		this.broadcasters = [];
		this.listeners = [];
	}

}

export default PubSub;