import Releasable from "interface/ables/Releasable";
import MessageCallback from "message/MessageCallback";
import { CallBackThisObject } from 'CydranTypes';

interface Broker extends Releasable {

	send(channelName: string, messageName: string, payload?: unknown): void;

	addListener(thisObject: CallBackThisObject, callback: MessageCallback): void;

	removeListener(thisObject: CallBackThisObject, callback: MessageCallback): void;

}

export default Broker;
