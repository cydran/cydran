import AbstractInputModelBehavior from "behavior/core/AbstractInputModelBehavior";
import { asIdentity } from "util/AsFunctions";
import { defaulted } from 'util/Utils';

const DATE_TYPES: string[] = ["date", "datetime-local", "month", "time", "week"];
const NUMBER_TYPES: string[] = ["number", "range"];

function isTypeWithin(el: HTMLElement, types: string[]): boolean {
	if (el.tagName.toLowerCase() !== "input") {
		return false;
	}

	const inputType: string = defaulted(el.getAttribute("type"), "text").toLowerCase();

	return types.includes(inputType);
}

type ValueAccessorStrategy<T> = (el: HTMLInputElement) => T;
type ValueMutatorStrategy<T> = (el: HTMLInputElement, value: T) => void;

const STRING_ACCESSOR: ValueAccessorStrategy<string> = (el: HTMLInputElement): string => el.value;
const STRING_MUTATOR: ValueMutatorStrategy<string> = (el: HTMLInputElement, value: string): void => {
	el.value = value;
}

const DATE_ACCESSOR: ValueAccessorStrategy<Date> = (el: HTMLInputElement): Date => el.valueAsDate;
const DATE_MUTATOR: ValueMutatorStrategy<Date> = (el: HTMLInputElement, value: Date): void => {
	el.valueAsDate = value;
}

const NUMBER_ACCESSOR: ValueAccessorStrategy<number> = (el: HTMLInputElement): number => el.valueAsNumber;
const NUMBER_MUTATOR: ValueMutatorStrategy<number> = (el: HTMLInputElement, value: number): void => {
	el.valueAsNumber = value;
}

class ValuedModelBehavior extends AbstractInputModelBehavior {

	private valueAccessor: ValueAccessorStrategy<unknown>;

	private valueMutator: ValueMutatorStrategy<unknown>;

	constructor() {
		super();
		this.setReducerFn(asIdentity);
	}

	protected onInitElement(el: HTMLElement): void {
		if (isTypeWithin(el, DATE_TYPES)) {
			this.valueAccessor = DATE_ACCESSOR;
			this.valueMutator = DATE_MUTATOR;
		} else if (isTypeWithin(el, NUMBER_TYPES)) {
			this.valueAccessor = NUMBER_ACCESSOR;
			this.valueMutator = NUMBER_MUTATOR;
		} else {
			this.valueAccessor = STRING_ACCESSOR;
			this.valueMutator = STRING_MUTATOR;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onInput(event?: Event): void {
		const value: unknown = this.valueAccessor(this.getEl());
		this.getMediator().set(value);
		this.sync();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onReset(event?: Event): void {
		this.getEl().value = this.getEl().defaultValue;
		this.onInput();
	}

	protected onChange(previous: unknown, current: unknown): void {
		this.valueMutator(this.getEl(), current);
		this.notify("modelChanged", current);
	}

}

export default ValuedModelBehavior;
