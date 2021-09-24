import BehaviorsRegistry from "behavior/BehaviorsRegistry";
import AbstractBehavior from "behavior/AbstractBehavior";

class CSSClass extends AbstractBehavior<any, HTMLElement, any> {

	public onMount(): void {
		if (this.isMutable()) {
			this.getMediator().watch(this, this.onTargetChange);
		}

		this.onTargetChange(null, this.getMediator().get());
	}

	private onTargetChange(previous: any, current: any): void {
		const oldClasses: string[] = (this.getEl().className || "").trim().split(" ");
		const newClasses: string[] = [];
		const map: any = current || {};

		for (const value of oldClasses) {
			if (!map.hasOwnProperty(value)) {
				newClasses.push(value);
			}
		}

		for (const key in map) {
			if (map.hasOwnProperty(key) && !!map[key]) {
				newClasses.push(key);
			}
		}

		this.getEl().className = newClasses.join(" ");
	}

}

BehaviorsRegistry.register("class", ["*"], CSSClass);

export default CSSClass;
