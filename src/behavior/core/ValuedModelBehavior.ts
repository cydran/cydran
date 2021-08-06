import AbstractBehavior from "behavior/AbstractBehavior";
import { INPUT_KEY, DOM_KEY } from "Constants";
import Factories from "internals/Factories";

class ValuedModel extends AbstractBehavior<string, HTMLInputElement, any> {

	public onInit(): void {
		this.bridge(INPUT_KEY);
		this.on(INPUT_KEY).forChannel(DOM_KEY).invoke(this.handleInput);
	}

	public onMount(): void {
		this.getMediator().watch(this, this.onTargetChange);
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

Factories.register("model", ["textarea"], ValuedModel);

export default ValuedModel;
