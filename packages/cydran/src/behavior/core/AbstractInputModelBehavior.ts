import AbstractBehavior from "behavior/AbstractBehavior";
import { BEHAVIOR_FORM_RESET, INPUT_KEY, CHANGE_KEY, DOM_KEY } from "CydranConstants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NO_UP_LISTENER: (payload: unknown) => void = (payload: unknown) => {};

abstract class AbstractInputModelBehavior extends AbstractBehavior<unknown, HTMLInputElement, unknown> {

	private inputListener: (payload: unknown) => void = NO_UP_LISTENER;

	private resetListener: (payload: unknown) => void = NO_UP_LISTENER;

	constructor() {
		super();
	}

	public onInit(): void {
		this.inputListener = (payload: unknown) => this.onInput(payload as Event);
		this.resetListener = (payload: unknown) => this.onReset(payload as Event);
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.inputListener);
		this.bridge(CHANGE_KEY);
		this.on(CHANGE_KEY).forChannel(DOM_KEY).invoke(this.inputListener);
		this.bridge(BEHAVIOR_FORM_RESET);
		this.on(BEHAVIOR_FORM_RESET).forChannel(DOM_KEY).invoke(this.resetListener);
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
