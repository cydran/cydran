import MessageContinuation from "continuation/MessageContinuation";

interface Messagable {

	message(channelName: string, messageName: string): MessageContinuation;

}

export default Messagable;
