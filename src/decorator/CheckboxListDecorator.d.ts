import { Decorator } from "../Core";
declare class CheckboxListDecorator extends Decorator<any> {
    private itemsExpression;
    private items;
    private itemsMediator;
    private checkboxChangeListener;
    wire(): void;
    unwire(): void;
    onCheckboxChange(event: Event): void;
    protected onChange(checked: string[], checkboxes: Array<{
        title: string;
        id: string;
    }>): void;
    protected onTargetChange(previous: any, value: any): void;
    protected onItemsChange(previous: any, value: any): void;
}
export default CheckboxListDecorator;
