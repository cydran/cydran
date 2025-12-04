import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import { DOM_KEY } from "CydranConstants";
import ElementOperationsImpl from "component/ElementOperationsImpl";
import ElementOperations from "component/ElementOperations";

class FocusBehavior extends AbstractBehavior<boolean, HTMLElement, unknown> {

	private shouldFocus: boolean;

	private operations: ElementOperations<HTMLElement>;

	constructor() {
		super();
		this.setReducerFn(asBoolean);
		this.setDefaultExpression("true");
	}

	public onInit(): void {
		this.bridge("focusout");
		this.on("focusout").forChannel(DOM_KEY).invoke(() => this.handleFocus());
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
