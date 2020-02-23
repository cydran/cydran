import Disposable from "@/pattern/Disposable";

interface Listener extends Disposable {

	register(messageName: string, fn: (payload: any) => void): void;

	receive(messageName: string, payload: any): void;

	getChannelName(): string;

}

export default Listener;
