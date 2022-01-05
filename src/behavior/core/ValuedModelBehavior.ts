import AbstractBehavior from "behavior/AbstractBehavior";
import { INPUT_KEY, DOM_KEY } from "Constants";
import BehaviorsRegistry from "behavior/BehaviorsRegistry";

class ValuedModel extends AbstractBehavior<string, HTMLInputElement, any> {

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
	}

	public onMount(): void {
		this.getMediator().watch(this, this.onTargetChange);
		this.onTargetChange(null, this.getMediator().get());
	}

	public handleInput(event: Event): void {
		this.$apply(() => {
			this.getMediator().set(this.getEl().value);
		}, []);
	}

	protected onTargetChange(previous: string, current: string): void {
		this.getEl().value = current;
	}

}

BehaviorsRegistry.register("model", ["textarea"], ValuedModel);

export default ValuedModel;
