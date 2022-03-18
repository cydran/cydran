import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import { INPUT_KEY, DOM_KEY } from "Constants";
import { BEHAVIOR_FORM_RESET } from "const/HardValues";

class CheckedBehavior extends AbstractBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super();
		this.setReducerFn(asBoolean);
	}

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.onInput);
		this.bridge(BEHAVIOR_FORM_RESET);
		this.on(BEHAVIOR_FORM_RESET).forChannel(DOM_KEY).invoke((event: Event) => this.onReset(event));
	}

	public onMount(): void {
		this.getMediator().watch(this, this.onChange);
		this.onChange(null, this.getMediator().get());
	}

	public onInput(event?: Event): void {
		this.$apply(() => {
			this.getMediator().set(this.getEl().checked);
		}, []);
	}

	protected onChange(previous: boolean, current: boolean): void {
		this.getEl().checked = current;
	}

	protected onReset(event?: Event): void {
		this.getEl().checked = this.getEl().defaultChecked;
		this.onInput();
	}

}

export default CheckedBehavior;
