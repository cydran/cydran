import Disposable from "interface/ables/Disposable";

interface Listener extends Disposable {

	register(messageName: string, callback: (payload: any) => void): void;

	receive(messageName: string, payload: any): void;

}

export default Listener;
