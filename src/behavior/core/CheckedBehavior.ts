import AbstractBehavior from "behavior/AbstractBehavior";
import { asBoolean } from "util/AsFunctions";
import { INPUT_KEY, DOM_KEY } from "Constants";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";

class Checked extends AbstractBehavior<boolean, HTMLInputElement, any> {

	constructor() {
		super(asBoolean);
	}

	public onMount(): void {
		this.bridge(INPUT_KEY);
		this.getMediator().watch(this, this.onTargetChange);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getMediator().set(this.getEl().checked);
		}, []);
	}

	protected onTargetChange(previous: boolean, current: boolean): void {
		this.getEl().checked = current;
	}

}

BehaviorsRegistry.register("checked", ["input"], Checked);

export default Checked;
