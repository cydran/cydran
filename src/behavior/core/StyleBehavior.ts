import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";

class Style extends AbstractBehavior<any, HTMLElement, any> {

	public onMount(): void {
		this.onTargetChange(null, this.getMediator().get());

		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}
	}

	protected onTargetChange(previous: any, current: any): void {
		if (current === null) {
			return;
		}

		for (const key in current) {
			if (!current.hasOwnProperty(key)) {
				continue;
			}

			this.getEl().style[key] = current[key] + "";
		}
	}

}

BehaviorsRegistry.register("style", ["*"], Style);

export default Style;
