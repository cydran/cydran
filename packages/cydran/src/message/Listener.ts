import Releasable from "interface/ables/Releasable";

interface Listener extends Releasable {

	register(messageName: string, callback: (payload: unknown) => void, before?: () => void, after?: () => void): void;

	receive(messageName: string, payload: unknown): void;

}

export default Listener;
