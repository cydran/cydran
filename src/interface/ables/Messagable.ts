import MessageContinuation from "component/continuation/MessageContinuation";

interface Messagable {

	message(channelName: string, messageName: string): MessageContinuation;

}

export default Messagable;
