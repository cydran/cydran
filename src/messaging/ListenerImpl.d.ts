import Listener from "./Listener";
declare class ListenerImpl implements Listener {
    private context;
    private channelName;
    private mappings;
    constructor(channelName: string, context: any);
    receive(messageName: string, payload: any): void;
    register(messageName: string, fn: Function): void;
    getChannelName(): string;
    dispose(): void;
}
export default ListenerImpl;
