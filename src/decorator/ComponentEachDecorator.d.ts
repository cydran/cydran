import { Decorator } from "../Core";
declare class ComponentEachDecorator extends Decorator<any> {
    private children;
    private tag;
    private id;
    private idKey;
    wire(): void;
    unwire(): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default ComponentEachDecorator;
