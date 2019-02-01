import { Decorator } from "../Core";
declare class SelectOptionsElementDecorator extends Decorator<string> {
    wire(): void;
    unwire(): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default SelectOptionsElementDecorator;
