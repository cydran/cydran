import { Decorator } from "../Core";
declare class ValuedModelElementDecorator extends Decorator<any> {
    private listener;
    wire(): void;
    unwire(): void;
    handle(event: Event): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default ValuedModelElementDecorator;
