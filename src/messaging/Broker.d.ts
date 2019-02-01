import Disposable from "../Disposable";
import Listener from "./Listener";
interface Broker extends Disposable {
    broadcast(channelName: string, messageName: string, payload: any): void;
    addListener(listener: Listener): void;
    removeListener(listener: Listener): void;
}
export default Broker;
