import { Decorator } from "../Core";
declare class FilterInputElementDecorator extends Decorator<string> {
    private listener;
    private filterValue;
    wire(): void;
    unwire(): void;
    handle(event: Event): void;
    protected onTargetChange(previous: any, current: any): void;
    private filter;
}
export default FilterInputElementDecorator;
