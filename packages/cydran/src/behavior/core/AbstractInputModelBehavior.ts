import AbstractBehavior from "behavior/AbstractBehavior";
import { BEHAVIOR_FORM_RESET, INPUT_KEY, CHANGE_KEY, DOM_KEY } from "CydranConstants";

abstract class AbstractInputModelBehavior extends AbstractBehavior<unknown, HTMLInputElement, unknown> {

	constructor() {
		super();
	}

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke((event: Event) => this.onInput(event));
		this.bridge(CHANGE_KEY);
		this.on(CHANGE_KEY).forChannel(DOM_KEY).invoke((event: Event) => this.onInput(event));
		this.bridge(BEHAVIOR_FORM_RESET);
		this.on(BEHAVIOR_FORM_RESET).forChannel(DOM_KEY).invoke((event: Event) => this.onReset(event));
		this.onInitElement(this.getEl());
	}

	public onMount(): void {
		this.getMediator().watch(this, this.onChange);
		this.onChange(null, this.getMediator().get());
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onInitElement(el: HTMLElement): void {
		// Intentionally left blank for subclasses to implement
	}

	protected abstract onInput(event?: Event): void;

	protected abstract onReset(event?: Event): void;

	protected abstract onChange(previous: unknown, current: unknown): void;

}

export default AbstractInputModelBehavior;
