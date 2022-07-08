import AbstractInputModelBehavior from "behavior/core/AbstractInputModelBehavior";

class ValuedModelBehavior extends AbstractInputModelBehavior {

	protected onInput(event?: Event): void {
		const value: string = this.getEl().value;
		this.getMediator().set(value);
		this.sync();
	}

	protected onReset(event?: Event): void {
		this.getEl().value = this.getEl().defaultValue;
		this.onInput();
	}

	protected onChange(previous: string, current: string): void {
		this.getEl().value = current;
		this.notify("modelChanged", current);
	}

}

export default ValuedModelBehavior;
