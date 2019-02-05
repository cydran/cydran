import Config from "./Config";
import { Component } from "./Core";
declare class Stage extends Component {
    private started;
    private rootId;
    private initializers;
    constructor(rootId: string);
    withInitializer(callback: () => void): Stage;
    protected wireListeners(): void;
    start(): void;
    private domReady;
    setComponent(component: Component): Stage;
    protected wire(): void;
    protected unwire(): void;
    getConfig(): Config;
}
export default Stage;
