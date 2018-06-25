import AbstractElementDecorator from "../mvvm/AbstractDecorator";

class FilterInputElementDecorator extends AbstractElementDecorator<string> {

	private filterValue: RegExp;

	public wire(): void {
		this.getEl().addEventListener('input', (event) => this.handle(event), false);
		this.filterValue = new RegExp(this.getTarget());
	}

	public unwire(): void {
		this.getEl().removeEventListener('input', (event) => this.handle(event));
		this.filterValue = null;
	}

	public handle(event: Event): void {
		let value: string = event.target['value']
		let filtered = this.filter(value);
		this.getEl()['value'] = filtered;
	}

	protected onTargetChange(value: any): void {
		this.filterValue = new RegExp(value);
	}

	private filter(value: string): string {
		return value.replace(this.filterValue, '');
	}

}

export default FilterInputElementDecorator;
