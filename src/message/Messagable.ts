interface Messagable {

	message(channelName: string, messageName: string, payload?: any): void;

}

export default Messagable;
