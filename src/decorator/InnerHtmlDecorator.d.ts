import { Decorator } from "../Core";
declare class InnerHtmlElementDecorator extends Decorator<string> {
    wire(): void;
    unwire(): void;
    protected onTargetChange(previous: any, current: any): void;
}
export default InnerHtmlElementDecorator;
