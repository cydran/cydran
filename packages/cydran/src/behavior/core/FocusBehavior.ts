import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import { DOM_KEY } from "CydranConstants";
import ElementOperationsImpl from "component/ElementOperationsImpl";
import ElementOperations from "component/ElementOperations";

const NO_UP_LISTENER: () => void = () => {};

class FocusBehavior extends AbstractBehavior<boolean, HTMLElement, unknown> {

	private shouldFocus: boolean;

	private operations: ElementOperations<HTMLElement>;

	private focusoutListener: () => void = NO_UP_LISTENER;

	constructor() {
		super();
		this.setReducerFn(asBoolean);
		this.setDefaultExpression("true");
		this.shouldFocus = false;
		this.operations = null as unknown as ElementOperations<HTMLElement>;
	}

	public onInit(): void {
		this.focusoutListener = () => this.handleFocus();
		this.bridge("focusout");
		this.on("focusout").forChannel(DOM_KEY).invoke(this.focusoutListener);
		this.operations = new ElementOperationsImpl<HTMLElement>(this.getEl());
	}

	public onMount(): void {
		this.shouldFocus = this.getMediator().get();

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onChange);
		}

		this.handleFocus();
	}

	public handleFocus(): void {
		if (this.shouldFocus) {
			this.operations.focus();
		}
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.shouldFocus = current;
		this.handleFocus();
	}

}

export default FocusBehavior;
