import Releasable from "interface/ables/Releasable";

interface Listener extends Releasable {

	register(messageName: string, callback: (payload: any) => void): void;

	receive(messageName: string, payload: any): void;

}

export default Listener;
