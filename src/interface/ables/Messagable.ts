import SendContinuation from "continuation/SendContinuation";

interface Messagable {

	send(messageName: string, payload?: any): SendContinuation;

}

export default Messagable;
