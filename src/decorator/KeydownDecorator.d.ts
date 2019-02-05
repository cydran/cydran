import { Decorator } from "../Core";
declare class KeydownElementDecorator extends Decorator<Function> {
    private listener;
    wire(): void;
    unwire(): void;
    handle(event: Event): void;
}
export default KeydownElementDecorator;
