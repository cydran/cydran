import {Decorator} from "../Core";

class FilterInputElementDecorator extends Decorator<string> {

	private listener: EventListenerOrEventListenerObject;

	private filterValue: RegExp;

	public wire(): void {
		this.listener = (event) => this.handle(event);
		this.getEl().addEventListener('input', this.listener, false);
		this.filterValue = new RegExp(this.getMediator().get());
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		this.getEl().removeEventListener('input', this.listener);
		this.filterValue = null;
		this.listener = null;
	}

	public handle(event: Event): void {
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
