import { Decorator } from "../Core";
declare class VisibleElementDecorator extends Decorator<boolean> {
    wire(): void;
    unwire(): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default VisibleElementDecorator;
