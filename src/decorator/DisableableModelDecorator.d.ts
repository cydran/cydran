import { Decorator } from "../Core";
declare class DisableableModelElementDecorator extends Decorator<boolean> {
    wire(): void;
    unwire(): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default DisableableModelElementDecorator;
