import { Decorator } from "../Core";
declare class AttributeElementDecorator extends Decorator<any> {
    wire(): void;
    unwire(): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default AttributeElementDecorator;
