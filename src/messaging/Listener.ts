import Disposable from '../Disposable';

interface Listener extends Disposable {

	register(messageName: string, fn: Function): void;

	receive(messageName: string, payload: any): void;

	getChannelName(): string;

}

export default Listener;