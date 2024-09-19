import AbstractBehavior from "behavior/AbstractBehavior";
import { BEHAVIOR_FORM_RESET, INPUT_KEY, CHANGE_KEY, DOM_KEY } from "CydranConstants";
import { asString } from "util/AsFunctions";

abstract class AbstractInputModelBehavior extends AbstractBehavior<string, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asString);
	}

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke((event: Event) => this.onInput(event));
		this.bridge(CHANGE_KEY);
		this.on(CHANGE_KEY).forChannel(DOM_KEY).invoke((event: Event) => this.onInput(event));
		this.bridge(BEHAVIOR_FORM_RESET);
		this.on(BEHAVIOR_FORM_RESET).forChannel(DOM_KEY).invoke((event: Event) => this.onReset(event));
	}

	public onMount(): void {
		this.getMediator().watch(this, this.onChange);
		this.onChange(null, this.getMediator().get());
	}

	protected abstract onInput(event?: Event): void;

	protected abstract onReset(event?: Event): void;

	protected abstract onChange(previous: string, current: string): void;

}

export default AbstractInputModelBehavior;
