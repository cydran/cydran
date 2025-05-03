import SendContinuation from "continuation/SendContinuation";

interface Messagable {

	send(messageName: string, payload?: unknown): SendContinuation;

}

export default Messagable;
