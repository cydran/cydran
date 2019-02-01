import { Decorator } from "../Core";
declare class ForceFocusElementDecorator extends Decorator<boolean> {
    private listener;
    private shouldFocus;
    wire(): void;
    unwire(): void;
    handle(event: Event): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default ForceFocusElementDecorator;
