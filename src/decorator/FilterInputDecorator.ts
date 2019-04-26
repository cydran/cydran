import {Decorator} from "../Core";

class FilterInputElementDecorator extends Decorator<string> {

	private filterValue: RegExp;

	public wire(): void {
		this.consume("input");
		this.listenTo("dom", "input", this.handleInput);
		this.filterValue = new RegExp(this.getMediator().get());
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		this.filterValue = null;
	}

	public handleInput(event: Event): void {
		let value: string = event.target['value']
		let filtered = this.filter(value);
		this.getEl()['value'] = filtered;
	}

	protected onTargetChange(previous: any, current: any): void {
		this.filterValue = new RegExp(current);
	}

	private filter(value: string): string {
		return value.replace(this.filterValue, '');
	}

}

export default FilterInputElementDecorator;
