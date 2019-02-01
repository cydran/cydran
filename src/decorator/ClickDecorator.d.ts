import { Decorator } from "../Core";
declare class ClickElementDecorator extends Decorator<any> {
    private listener;
    wire(): void;
    unwire(): void;
    handleClick(event: Event): void;
}
export default ClickElementDecorator;
