import AbstractInputModelBehavior from "behavior/core/AbstractInputModelBehavior";

class RadioModelBehavior extends AbstractInputModelBehavior {

	public onInput(): void {
		const value: string = this.getEl().value;

		if (this.getEl().checked) {
			this.getMediator().set(value);
			this.sync();
		}
	}

	protected onChange(previous: string, current: string): void {
		if (this.getEl().value === current) {
			this.getEl().checked = true;
		}

		this.notify("modelChanged", current);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onReset(event?: Event): void {
		this.getEl().checked = this.getEl().defaultChecked;
		this.onInput();
	}

}

export default RadioModelBehavior;
