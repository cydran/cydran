import Factories from "internals/Factories";
import AbstractBehavior from "behavior/AbstractBehavior";

class Style extends AbstractBehavior<any, HTMLElement, any> {

	public populate(): void {
		this.onTargetChange(null, this.getMediator().get());
	}

	public onMount(): void {
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

Factories.register("style", ["*"], Style);

export default Style;
