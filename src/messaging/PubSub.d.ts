import Disposable from "../Disposable";
import Module from "../Module";
declare class PubSub implements Disposable {
    private listeners;
    private listenersByChannel;
    private moduleInstance;
    private context;
    constructor(context: any, moduleInstance?: Module);
    listenTo(channel: string, messageName: string, target: Function): void;
    message(channelName: string, messageName: string, payload: any): void;
    broadcast(channelName: string, messageName: string, payload: any): void;
    broadcastGlobally(channelName: string, messageName: string, payload: any): void;
    dispose(): void;
}
export default PubSub;
