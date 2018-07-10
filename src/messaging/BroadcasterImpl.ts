import Broadcaster from './Broadcaster';
import Broker from './Broker';
import Logger from '../logger/Logger';
import LoggerFactory from '../logger/LoggerFactory';

class BroadcasterImpl implements Broadcaster {

	private logger: Logger = LoggerFactory.getLogger('BroadcasterImpl');

	private broker: Broker;

	private channelName: string;

	constructor(channelName: string) {
		this.channelName = channelName;
	}

	public broadcast(messageName: string, payload: any): void {
		if (!this.broker) {
			this.logger.trace('Broker is null, returning');
			return;
		}

		this.broker.broadcast(this.channelName, messageName, payload);
	}

	public setBroker(broker: Broker): void {
		this.broker = broker;
	}

	public getChannelName(): string {
		return this.channelName;
	}

	public dispose(): void {
		// TODO - Implement
	}

}

export default BroadcasterImpl;